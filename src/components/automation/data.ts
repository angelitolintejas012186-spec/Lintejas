/* Business Automation (/#/automation) — the automation catalogue. Plain, honest copy only:
   no results, no figures, no prices, no promised setup times. "pilot" = open for the pilot now;
   "later" = planned, visitors can ask to be notified. Numbers (#1–#11) are the internal ids. */
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

export const AUTOMATIONS: Automation[] = [
  // ── Pilot open ───────────────────────────────────────────────────────────
  { n: 11, name: 'Online booking page', category: 'Customers', status: 'pilot', icon: CalendarCheck,
    line: 'Customers book a time themselves; you see every booking in one place.',
    what: 'Gives your business its own booking page. Customers pick a service and a free time slot, and you get the booking straight away.',
    how: ['We set up your services and opening hours with you.', 'You share your booking link with customers.', 'New bookings come to you to confirm.'],
    goodFor: ['Salons & spas', 'Clinics', 'Repair & home services', 'Tutors'] },
  { n: 1, name: 'Win back old customers', category: 'Customers', status: 'pilot', icon: HeartHandshake,
    line: 'Finds customers who stopped coming and drafts a friendly hello.',
    what: 'Looks at who has not bought from you in a while and drafts a short, friendly message to invite them back. Nothing is sent until you approve it.',
    how: ['We connect your customer list with you.', 'It picks out customers who have gone quiet.', 'You read each draft and approve or skip it.'],
    goodFor: ['Shops', 'Food service', 'Salons', 'Online sellers'] },
  { n: 4, name: 'Collect late payments', category: 'Money', status: 'pilot', icon: HandCoins,
    line: 'Drafts polite reminders for payments that are overdue.',
    what: 'Keeps track of who owes you and when it was due, then drafts a polite reminder. You approve every reminder before it goes out.',
    how: ['We set up your list of open payments with you.', 'It notices when a payment is overdue.', 'You approve the reminder; it never sends on its own.'],
    goodFor: ['Credit customers (utang)', 'Wholesale', 'Services billed later'] },
  { n: 10, name: 'Keep customers from leaving', category: 'Customers', status: 'pilot', icon: UserCheck,
    line: 'Spots regulars who are coming less often, before they stop.',
    what: 'Watches for regular customers whose visits or orders are slowing down and flags them for you, with a suggested check-in message to approve.',
    how: ['We set up what "a regular" means for your business.', 'It flags regulars who are slowing down.', 'You decide who to contact and approve the message.'],
    goodFor: ['Shops with regulars', 'Subscriptions', 'Salons & clinics'] },

  // ── Coming later ─────────────────────────────────────────────────────────
  { n: 8, name: 'Write product listings', category: 'Documents', status: 'later', icon: ShoppingBag,
    line: 'Drafts clear product descriptions for your online shop.',
    what: 'Turns your product details into clear listing text for your online shop or marketplace page. You edit and approve every listing.',
    how: ['You give the product name, details and photos.', 'It drafts the title and description.', 'You edit and approve before posting.'],
    goodFor: ['Online sellers', 'Shops going online'] },
  { n: 9, name: 'Write SOPs & training', category: 'Team', status: 'later', icon: BookOpen,
    line: 'Turns how you work into simple step-by-step guides for staff.',
    what: 'Helps you write down how things are done in your business as simple step-by-step guides your staff can follow.',
    how: ['You describe a task in your own words.', 'It drafts a step-by-step guide.', 'You check it and share it with your team.'],
    goodFor: ['Growing teams', 'New staff training'] },
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
