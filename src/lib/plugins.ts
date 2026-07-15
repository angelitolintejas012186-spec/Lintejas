import type { PluginManifest } from './types'

export const PLUGIN_REGISTRY: PluginManifest[] = [
  {
    id: 'announcement-bar',
    name: 'Announcement Bar',
    description: 'Display a dismissable message banner at the top of all pages',
    version: '1.0.0',
    category: 'marketing',
    icon: '📣',
    mountPoint: 'home-section',
    settingsSchema: {
      message:  { type: 'text',   label: 'Message',          required: true, placeholder: 'Welcome to Lintejas!' },
      link:     { type: 'url',    label: 'Link URL',          placeholder: 'https://...' },
      linkText: { type: 'text',   label: 'Link Text',         placeholder: 'Learn more' },
      color:    { type: 'color',  label: 'Background Colour', defaultValue: '#C9A84C' },
      dismissable: { type: 'toggle', label: 'Can be dismissed', defaultValue: true },
    },
  },
  {
    id: 'seo-manager',
    name: 'SEO Manager',
    description: 'Set title, meta description, and Open Graph image for each page',
    version: '1.0.0',
    category: 'utility',
    icon: '🔍',
    settingsSchema: {
      defaultTitle:       { type: 'text',     label: 'Default Page Title',       placeholder: 'Lintejas — Technology Holding Company' },
      defaultDescription: { type: 'textarea', label: 'Default Meta Description', placeholder: 'Technology holding company…' },
      ogTitle:            { type: 'text',     label: 'OG Title Override' },
    },
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Inject a Google Analytics (GA4) or Plausible tracking script',
    version: '1.0.0',
    category: 'analytics',
    icon: '📊',
    settingsSchema: {
      provider:   { type: 'select', label: 'Provider',    options: ['google-analytics', 'plausible'], required: true },
      trackingId: { type: 'text',   label: 'Tracking ID (GA4 measurement ID or Plausible domain)', required: true, placeholder: 'G-XXXXXXXXXX' },
    },
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Enhanced contact form with configurable fields and email routing',
    version: '1.0.0',
    category: 'content',
    icon: '✉️',
    mountPoint: 'page',
    settingsSchema: {
      recipient: { type: 'email', label: 'Recipient Email', required: true, placeholder: 'hello@lintejas.com' },
      subject:   { type: 'text',  label: 'Subject Prefix',  placeholder: 'Website Enquiry:' },
      successMessage: { type: 'text', label: 'Success Message', placeholder: 'Thank you, we will be in touch.' },
      showPhone:    { type: 'toggle', label: 'Show phone field',   defaultValue: false },
      showCompany:  { type: 'toggle', label: 'Show company field', defaultValue: true },
    },
  },
]

export function getPlugin(id: string): PluginManifest | undefined {
  return PLUGIN_REGISTRY.find(p => p.id === id)
}
