import React, {
  createContext, useContext, useEffect, useRef, useState,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { DEFAULT_CONFIG, DEFAULT_THEME_VARS } from './defaults'
import { supabase, fetchSiteConfig, saveSiteConfig, uploadAsset as supabaseUpload } from './supabase'
import type { SiteConfig } from './types'

interface SiteConfigCtx {
  config: SiteConfig
  isLoading: boolean
  isDirty: boolean
  user: User | null
  updateConfig: (patch: Partial<SiteConfig> | ((prev: SiteConfig) => SiteConfig)) => void
  saveConfig: () => Promise<void>
  uploadAsset: (file: File, name: string) => Promise<string>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const Ctx = createContext<SiteConfigCtx | null>(null)

const LS_KEY = 'lintejas_config'

/* Recursive merge: DEFAULT_CONFIG supplies missing keys at every depth.
   Arrays (e.g. plugins) are replaced, not element-merged. */
function deepMerge<T>(target: T, source: unknown): T {
  if (source === null || source === undefined || typeof source !== 'object' || Array.isArray(source)) {
    return (source !== undefined ? source : target) as T
  }
  const result = { ...target } as Record<string, unknown>
  const src = source as Record<string, unknown>
  for (const key of Object.keys(src)) {
    const tv = result[key], sv = src[key]
    if (sv !== null && typeof sv === 'object' && !Array.isArray(sv) && typeof tv === 'object' && tv !== null && !Array.isArray(tv)) {
      result[key] = deepMerge(tv, sv)
    } else if (sv !== undefined) {
      result[key] = sv
    }
  }
  return result as T
}

function loadLocal(): SiteConfig {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return DEFAULT_CONFIG
    return deepMerge(DEFAULT_CONFIG, JSON.parse(raw))
  } catch {
    return DEFAULT_CONFIG
  }
}

function applyThemeVars(vars: Record<string, string>) {
  const root = document.documentElement
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
}

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(loadLocal)
  const [isLoading, setIsLoading] = useState(true)
  const [isDirty, setIsDirty] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Apply theme vars on every config change */
  useEffect(() => {
    applyThemeVars(config.theme.vars ?? DEFAULT_THEME_VARS)
  }, [config.theme.vars])

  /* Auth listener */
  useEffect(() => {
    if (!supabase) { setIsLoading(false); return }
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  /* Load config from Supabase on mount */
  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const remote = await fetchSiteConfig()
      if (remote) {
        const merged = deepMerge(DEFAULT_CONFIG, remote)
        setConfig(merged)
        localStorage.setItem(LS_KEY, JSON.stringify(merged))
      }
      setIsLoading(false)
    })()
  }, [])

  function updateConfig(patch: Partial<SiteConfig> | ((prev: SiteConfig) => SiteConfig)) {
    setConfig(prev => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
    setIsDirty(true)
  }

  async function saveConfig() {
    await saveSiteConfig(config)
    setIsDirty(false)
  }

  async function uploadAsset(file: File, name: string): Promise<string> {
    if (!supabase) {
      return URL.createObjectURL(file)
    }
    return supabaseUpload(file, name)
  }

  async function signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
  }

  /* Auto-save 2s after changes when logged in */
  useEffect(() => {
    if (!isDirty || !user) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveSiteConfig(config).catch(console.error)
      setIsDirty(false)
    }, 2000)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [config, isDirty, user])

  return (
    <Ctx.Provider value={{ config, isLoading, isDirty, user, updateConfig, saveConfig, uploadAsset, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSiteConfig(): SiteConfigCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSiteConfig must be used inside SiteConfigProvider')
  return ctx
}
