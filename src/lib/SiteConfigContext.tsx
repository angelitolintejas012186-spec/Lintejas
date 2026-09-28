import React, {
  createContext, useContext, useEffect, useRef, useState,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { DEFAULT_CONFIG, DEFAULT_THEME_VARS } from './defaults'
import type { SiteConfig } from './types'

/* B2 (perf): './supabase' is loaded via a dynamic import() so the ~212 KB supabase
   client is code-split OUT of the public entry graph (no modulepreload on the
   homepage). The public config read runs AFTER first paint (bundled defaults render
   immediately); admin actions load it on demand. `getSb()` memoises the one module
   promise so the client stays a singleton. The type-only `User` import above is
   erased at build and pulls nothing into the bundle. */
let _sbPromise: Promise<typeof import('./supabase')> | null = null
function getSb() { return (_sbPromise ??= import('./supabase')) }

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

  /* Auth listener + config read — DEFERRED to after first paint (B2). Supabase is
     dynamic-imported here, so the public bundle renders defaults with no supabase
     dependency; the remote read + auth wiring happen on idle. */
  useEffect(() => {
    let cancelled = false
    let unsub: (() => void) | null = null

    const run = async () => {
      const sb = await getSb()
      if (cancelled) return
      if (!sb.supabase) { setIsLoading(false); return }
      // auth
      sb.supabase.auth.getUser().then(({ data }) => { if (!cancelled) setUser(data.user ?? null) })
      const { data: { subscription } } = sb.supabase.auth.onAuthStateChange((_ev, session) => {
        if (!cancelled) setUser(session?.user ?? null)
      })
      unsub = () => subscription.unsubscribe()
      // config
      const remote = await sb.fetchSiteConfig()
      if (!cancelled && remote) {
        const merged = deepMerge(DEFAULT_CONFIG, remote)
        setConfig(merged)
        localStorage.setItem(LS_KEY, JSON.stringify(merged))
      }
      if (!cancelled) setIsLoading(false)
    }

    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback
    const kick = () => { if (idle) idle(run); else setTimeout(run, 1) }
    if (document.readyState === 'complete') kick()
    else window.addEventListener('load', kick, { once: true })

    return () => { cancelled = true; if (unsub) unsub() }
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
    const { saveSiteConfig } = await getSb()
    await saveSiteConfig(config)
    setIsDirty(false)
  }

  async function uploadAsset(file: File, name: string): Promise<string> {
    const { supabase, uploadAsset: supabaseUpload } = await getSb()
    if (!supabase) {
      return URL.createObjectURL(file)
    }
    return supabaseUpload(file, name)
  }

  async function signIn(email: string, password: string) {
    const { supabase } = await getSb()
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    const { supabase } = await getSb()
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
  }

  /* Auto-save 2s after changes when logged in */
  useEffect(() => {
    if (!isDirty || !user) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      getSb().then(({ saveSiteConfig }) => saveSiteConfig(config).catch(console.error))
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
