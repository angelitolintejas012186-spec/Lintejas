import { createClient } from '@supabase/supabase-js'
import type { SiteConfig } from './types'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export const isSupabaseConfigured = Boolean(supabase)

/* ── site_config helpers ──────────────────────────── */

export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('site_config')
    .select('config')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()
  if (error || !data) return null
  return data.config as SiteConfig
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  if (!supabase) return
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await supabase
    .from('site_config')
    .select('id')
    .eq('owner_id', user.id)
    .limit(1)
    .single()

  if (existing) {
    await supabase
      .from('site_config')
      .update({ config, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('site_config')
      .insert({ owner_id: user.id, config })
  }
}

/* ── Storage helpers ──────────────────────────────── */

export async function uploadAsset(file: File, name: string): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured')
  const ext  = file.name.split('.').pop() ?? 'bin'
  const path = `${name}_${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('lintejas-assets')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('lintejas-assets').getPublicUrl(path)
  return data.publicUrl
}
