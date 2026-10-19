/* Business Automation (/automation) — the automation catalogue. Plain, honest copy only:
   no results, no figures, no prices, no promised setup times. "pilot" = built and open for the pilot
   (2026-10-14: #4, #1, #10, #11, #8, #9); "later" = planned, visitors can ask to be notified.
   Numbers (#1–#11) are the internal ids. */
import type { LucideIcon } from 'lucide-react'
import {
  CalendarCheck, HeartHandshake, HandCoins, UserCheck, ShoppingBag, BookOpen,
  ClipboardList, FileSignature, MessageSquareText, Headphones, PhoneMissed,
} from 'lucide-react'

export type Category = 'Customers' | 'Money' | 'Documents' | 'Team'
export type Status = 'pilot' | 'later'

export interface Automation {
  n: number
  name: string
  category: Category
  status: Status
  icon: LucideIcon
  line: string        // one-line tile description
  what: string        // sheet: what it does
  how: [string, string, string]
  goodFor: string[]
  note?: string       // sheet: honest limit (shown under "what it does")
}

export const CATEGORIES: Category[] = ['Customers', 'Money', 'Documents', 'Team']

export const CAT_COLOR: Record<Category, string> = {
  Customers: '#6A4BF0', Money: '#0F9A7E', Documents: '#D08A1A', Team: '#D2456E',
}
/* Same hues, darkened where needed so small text on a white tile stays ≥ 4.5:1. */
export const CAT_TEXT: Record<Category, string> = {
  Customers: '#5B3FD9', Money: '#0B7A64', Documents: '#8F5A08', Team: '#B23158',
}

/* The pilot app (automation.lintejas.io). The "Open the pilot app" button stays HIDDEN until this is true —
   switch it on only when the app is actually open for pilots. Until then "Join the pilot" is the main action. */
export const BA_APP_OPEN = false
export const BA_APP_URL = 'https://automation.lintejas.io'

export const AUTOMATIONS: Automation[] = [
  // ── Pilot open (built and in the pilot app) ─────────────────────────────
  { n: 4, name: 'Collect late payments', category: 'Money', status: 'pilot', icon: HandCoins,
    line: 'Drafts polite reminders for payments that are overdue.',
    what: 'Keeps track of who owes you and when it was due, then drafts a polite reminder. You send every reminder yourself from your own phone; nothing goes out on its own.',
    how: ['You add your list of open payments, or upload it as a CSV file.', 'It shows who is due for a reminder each day.', 'You send the message yourself and mark payments as paid.'],
    goodFor: ['Credit customers (utang)', 'Wholesale', 'Services billed later'] },
  { n: 1, name: 'Win back customers', category: 'Customers', status: 'pilot', icon: HeartHandshake,
    line: 'Finds customers who stopped coming and drafts a friendly hello.',
    what: 'Looks at who has not visited in a while and drafts a short, friendly message to invite them back. It only includes customers who agreed to receive messages, and nothing is sent until you send it.',
    how: ['You upload your customer list and mark who agreed to messages.', 'It picks out customers who have gone quiet.', 'You read each draft and send it yourself, or skip it.'],
    goodFor: ['Shops', 'Food service', 'Salons', 'Online sellers'] },
  { n: 10, name: 'Check in with regular customers', category: 'Customers', status: 'pilot', icon: UserCheck,
    line: 'Spots regulars who are coming less often, and drafts a check-in.',
    what: 'Watches for regular customers who have been away longer than usual and drafts a short check-in message for you to send. Only customers who agreed to messages are included.',
    how: ['You log visits, or upload a visit history.', 'It notices regulars who are away longer than usual.', 'You decide who to contact and send the message yourself.'],
    goodFor: ['Shops with regulars', 'Subscriptions', 'Salons & clinics'] },
  { n: 11, name: 'Online booking page', category: 'Customers', status: 'pilot', icon: CalendarCheck,
    line: 'Customers book a time themselves; you see every booking in one place.',
    what: 'Gives your business its own booking page. Customers pick a service and a free time, and you accept, decline or move each request.',
    note: 'An optional deposit uses your own GCash or Maya QR. No payment passes through the app.',
    how: ['You set up your services, opening hours and booking link.', 'You share the link with your customers.', 'New requests come to you to accept, decline or move.'],
    goodFor: ['Salons & spas', 'Clinics', 'Repair & home services', 'Tutors'] },
  { n: 8, name: 'Product listings', category: 'Documents', status: 'pilot', icon: ShoppingBag,
    line: 'Writes listing text for your online shops from your product facts.',
    what: 'Turns the product facts you give into a title, highlights and a description for Shopee, Lazada, TikTok Shop, Facebook Marketplace and your own website. Missing details are marked for you to fill in.',
    note: 'Health, food and cosmetic claims are left out unless you add them yourself. Nothing is posted for you.',
    how: ['You type the product facts, and add a photo if you want.', 'It writes a listing for each sales channel you choose.', 'You edit it, then copy it into your shop.'],
    goodFor: ['Online sellers', 'Shops going online'] },
  { n: 9, name: 'Training guides', category: 'Team', status: 'pilot', icon: BookOpen,
    line: 'Turns how you work into step-by-step guides for your staff.',
    what: 'Turns your answers to a few short questions into a step-by-step guide with a checklist and safety notes. Nothing is added that you did not say; missing details are marked for you.',
    how: ['You answer seven short questions about a task.', 'It writes the steps, a checklist and safety notes.', 'You edit it, then print it or save it as a PDF, with a sign-off sheet for staff.'],
    goodFor: ['Growing teams', 'New staff training'] },

  // ── Coming later ─────────────────────────────────────────────────────────
  { n: 3, name: 'Answer tenders & RFPs', category: 'Money', status: 'later', icon: ClipboardList,
    line: 'Helps you prepare answers to tender and quotation requests.',
    what: 'Reads a tender or request for proposal and helps you prepare a first draft of your answer from your own business details. You review everything before you submit.',
    how: ['You upload the tender or request.', 'It drafts answers from your business details.', 'You review, edit and submit it yourself.'],
    goodFor: ['Suppliers', 'Contractors', 'B2B services'] },
  { n: 7, name: 'Pre-check contracts', category: 'Documents', status: 'later', icon: FileSignature,
    line: 'Pre-screens a contract and points out parts to ask about.',
    what: 'Reads a contract and points out parts you may want to ask about, in plain words.',
    note: 'This is a pre-screen only — it is not legal advice. For legal questions, talk to a lawyer.',
    how: ['You upload the contract.', 'It lists parts worth a closer look.', 'You decide what to ask your lawyer or the other party.'],
    goodFor: ['Leases', 'Supplier agreements', 'Service contracts'] },
  { n: 6, name: 'Read customer feedback', category: 'Customers', status: 'later', icon: MessageSquareText,
    line: 'Sorts reviews and comments into what customers like and dislike.',
    what: 'Reads your customer reviews and comments and groups them into clear themes, so you can see what people like and what to fix.',
    how: ['We connect where your feedback comes in.', 'It groups comments into themes.', 'You see a short summary and decide what to act on.'],
    goodFor: ['Food service', 'Shops', 'Online sellers'] },
  { n: 5, name: 'Score sales calls', category: 'Team', status: 'later', icon: Headphones,
    line: 'Gives your sales team simple feedback on their calls.',
    what: 'Reviews recorded sales calls against a simple checklist you agree on, so your team gets clear feedback on what went well and what to practise.',
    how: ['You agree a short checklist for a good call.', 'It reviews recorded calls against it.', 'You and your team see the feedback.'],
    goodFor: ['Sales teams', 'Call-based businesses'] },
  { n: 2, name: 'Answer missed calls', category: 'Customers', status: 'later', icon: PhoneMissed,
    line: 'Follows up on calls you could not pick up. Europe first.',
    what: 'When you miss a call, it follows up so the caller is not left waiting.',
    note: 'Planned for businesses in Europe first.',
    how: ['We set up your business number with you.', 'A missed call is noticed.', 'A follow-up message you approved in advance goes to the caller.'],
    goodFor: ['Trades', 'Clinics', 'Busy front desks'] },
]

export const BUSINESS_TYPES = [
  'Retail', 'Food service', 'Food manufacturing', 'Online seller',
  'Clinic/Salon/Spa', 'Services', 'Agriculture', 'Other',
] as const

export const COUNTRIES = ['Philippines', 'Europe', 'Other'] as const
