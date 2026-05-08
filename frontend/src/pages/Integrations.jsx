import React, { useState } from 'react';
import {
  CheckCircle, XCircle, ExternalLink, Search,
  Phone, FileText, BarChart2, Mail,
  Calendar, DollarSign, Database, Globe,
  Users, ChevronDown, ChevronUp
} from 'lucide-react';

/* ─── Integration Master List ─── */
const CATEGORIES = [
  {
    id: 'mls',
    label: 'MLS / IDX Property Data',
    icon: Globe,
    color: 'blue',
    description: 'Live property feeds, IDX search portals, and behavioral tracking',
    integrations: [
      {
        id: 'bright_mls',
        name: 'Bright MLS',
        logo: '🏡',
        status: 'connected',
        tier: 'core',
        description: 'Mid-Atlantic IDX feed covering MD, DC, VA, DE, NJ, PA. Live listings, saved searches, and property alerts.',
        requirements: ['MLS Participant membership', 'IDX License Agreement', 'API key from Bright MLS portal'],
        envKeys: ['BRIGHT_MLS_API_KEY', 'BRIGHT_MLS_IDX_KEY'],
        docs: 'https://brightmls.com/idx',
        capabilities: ['Live property search', 'Property detail pages', 'Automated e-alerts', 'New listing notifications', 'Behavioral tracking (views)'],
      },
      {
        id: 'crmls',
        name: 'CRMLS',
        logo: '🌴',
        status: 'available',
        tier: 'standard',
        description: "California's largest MLS. Covers Southern CA, Inland Empire, and surrounding markets.",
        requirements: ['CRMLS membership', 'RESO Web API access approval', 'Data license agreement'],
        envKeys: ['CRMLS_API_KEY', 'CRMLS_ACCESS_TOKEN'],
        docs: 'https://crmls.org/technology/api',
        capabilities: ['RESO Web API', 'IDX display', 'Open house data', 'Market stats'],
      },
      {
        id: 'stellar_mls',
        name: 'Stellar MLS',
        logo: '⭐',
        status: 'available',
        tier: 'standard',
        description: 'Florida and Puerto Rico MLS covering 70,000+ listings. RESO-compliant API.',
        requirements: ['Stellar MLS membership', 'IDX agreement', 'API access approval'],
        envKeys: ['STELLAR_MLS_API_KEY'],
        docs: 'https://stellarmls.com/idx',
        capabilities: ['IDX search', 'Listing alerts', 'Market reports', 'Showing requests'],
      },
      {
        id: 'idx_broker',
        name: 'IDX Broker',
        logo: '🔗',
        status: 'available',
        tier: 'standard',
        description: 'Universal IDX middleware — connects to 600+ MLS boards nationwide via one API.',
        requirements: ['IDX Broker subscription ($50–150/mo)', 'MLS membership in target market', 'API key from IDX Broker dashboard'],
        envKeys: ['IDX_BROKER_API_KEY'],
        docs: 'https://middleware.idxbroker.com/docs',
        capabilities: ['Multi-MLS support', 'Lead capture widgets', 'Saved searches', 'Listing pages', 'Market widgets'],
      },
      {
        id: 'real_geeks',
        name: 'Real Geeks IDX',
        logo: '⚡',
        status: 'available',
        tier: 'standard',
        description: 'High-converting IDX websites with built-in lead capture and CRM sync.',
        requirements: ['Real Geeks account', 'MLS approval', 'CRM API key'],
        envKeys: ['REAL_GEEKS_API_KEY', 'REAL_GEEKS_SITE_ID'],
        docs: 'https://realgeeks.com/api',
        capabilities: ['IDX website', 'Lead import', 'Behavioral tracking', 'Google PPC integration'],
      },
    ],
  },
  {
    id: 'communication',
    label: 'Communication & Dialing',
    icon: Phone,
    color: 'red',
    description: 'SMS, voice, video, voicemail drop, and power dialing tools',
    integrations: [
      {
        id: 'twilio',
        name: 'Twilio (SMS + Voice)',
        logo: '📱',
        status: 'connected',
        tier: 'core',
        description: 'Programmable SMS and voice. Powers click-to-call, inbound routing, drip campaigns, and call recording.',
        requirements: ['Twilio account', 'Account SID + Auth Token', 'Purchased phone number ($1/mo)', 'A2P 10DLC registration for SMS campaigns (required by carriers)'],
        envKeys: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'],
        docs: 'https://console.twilio.com',
        capabilities: ['Click-to-call from lead profile', 'Outbound SMS campaigns', 'Inbound SMS routing', 'Call recording', 'AI nurture sequences', 'Voicemail detection'],
      },
      {
        id: 'mojo',
        name: 'Mojo Dialer',
        logo: '☎️',
        status: 'available',
        tier: 'standard',
        description: 'Power dialer built for real estate — triple-line dialing, FSBO/expired lists, CRM sync.',
        requirements: ['Mojo Dialer subscription ($99–149/mo)', 'API key from Mojo account settings'],
        envKeys: ['MOJO_API_KEY', 'MOJO_SECRET'],
        docs: 'https://mojosells.com/api',
        capabilities: ['Triple-line power dialer', 'FSBO/expired lists', 'Local presence caller ID', 'CRM sync', 'Call recording'],
      },
      {
        id: 'callrail',
        name: 'CallRail',
        logo: '📞',
        status: 'available',
        tier: 'standard',
        description: 'Call tracking and analytics — know which marketing source drove every inbound call.',
        requirements: ['CallRail account', 'API key from account settings', 'Tracking numbers assigned per source'],
        envKeys: ['CALLRAIL_API_KEY', 'CALLRAIL_ACCOUNT_ID'],
        docs: 'https://apidocs.callrail.com',
        capabilities: ['Source attribution per call', 'Call recording', 'Transcription', 'Google Ads call conversion', 'Lead tagging'],
      },
      {
        id: 'bombbomb',
        name: 'BombBomb',
        logo: '🎥',
        status: 'available',
        tier: 'premium',
        description: 'Video email for personal follow-up. Record a quick video from lead profile and send instantly.',
        requirements: ['BombBomb account ($33–49/mo)', 'API key', 'Email integration'],
        envKeys: ['BOMBBOMB_API_KEY'],
        docs: 'https://bombbomb.com/developer',
        capabilities: ['Video emails from CRM', 'Open/play tracking', 'Video drip campaigns', 'Screen recording', 'Animated GIF preview'],
      },
      {
        id: 'slybroadcast',
        name: 'Slybroadcast',
        logo: '📣',
        status: 'available',
        tier: 'standard',
        description: 'Ringless voicemail drop — leave a voicemail without ringing the phone. High open rates.',
        requirements: ['Slybroadcast account', 'API credentials', 'Recorded audio file (.mp3)', 'TCPA compliance'],
        envKeys: ['SLYBROADCAST_USERNAME', 'SLYBROADCAST_PASSWORD'],
        docs: 'https://slybroadcast.com/api',
        capabilities: ['Ringless voicemail', 'Bulk drops', 'Schedule delivery', 'Mobile + landline', 'Analytics'],
      },
    ],
  },
  {
    id: 'lead_gen',
    label: 'Lead Generation & Portals',
    icon: Users,
    color: 'green',
    description: 'Inbound lead sources — portals, PPC, social, and referral platforms',
    integrations: [
      {
        id: 'zillow',
        name: 'Zillow Premier Agent',
        logo: '🏠',
        status: 'available',
        tier: 'premium',
        description: 'Auto-import Zillow leads directly into CRM with source tagging, budget, and property interest.',
        requirements: ['Zillow Premier Agent account', 'Zillow API access (apply at zillow.com/api)', 'Webhook endpoint configured'],
        envKeys: ['ZILLOW_API_KEY', 'ZILLOW_ZWSID'],
        docs: 'https://www.zillow.com/howto/api/APIOverview.htm',
        capabilities: ['Lead auto-import', 'Property interest tracking', 'Budget capture', 'Response time tracking', 'Lead routing'],
      },
      {
        id: 'realtor',
        name: 'Realtor.com Connections',
        logo: '🔑',
        status: 'available',
        tier: 'premium',
        description: 'Import leads from Realtor.com Connections Plus — includes buyer intent data and property viewed.',
        requirements: ['Connections Plus subscription', 'Realtor.com partner API access', 'Webhook URL registration'],
        envKeys: ['REALTOR_COM_API_KEY', 'REALTOR_COM_PARTNER_ID'],
        docs: 'https://developer.realtor.com',
        capabilities: ['Lead import with intent data', 'Property interest', 'Response timer alerts', 'Tour requests', 'Buyer score'],
      },
      {
        id: 'facebook_leads',
        name: 'Facebook Lead Ads',
        logo: '📘',
        status: 'available',
        tier: 'standard',
        description: 'Instant lead form submissions from Facebook and Instagram ads flow directly into CRM.',
        requirements: ['Facebook Business Manager access', 'Facebook App (developer.facebook.com)', 'Page access token', 'Webhook configured'],
        envKeys: ['FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET', 'FACEBOOK_PAGE_ACCESS_TOKEN'],
        docs: 'https://developers.facebook.com/docs/marketing-api/guides/lead-ads',
        capabilities: ['Real-time lead import', 'Ad campaign attribution', 'Custom form fields mapping', 'Instagram leads', 'Audience sync'],
      },
      {
        id: 'google_ads',
        name: 'Google Ads / PPC',
        logo: '🎯',
        status: 'connected',
        tier: 'core',
        description: 'Track every PPC lead from click to close. Auto-tag leads from Google Ads with campaign data.',
        requirements: ['Google Ads account', 'Developer token (apply in Google Ads API Center)', 'OAuth 2.0 credentials', 'Manager account (MCC) recommended'],
        envKeys: ['GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_CUSTOMER_ID', 'GOOGLE_ADS_REFRESH_TOKEN'],
        docs: 'https://ads.google.com/aw/apicenter',
        capabilities: ['Lead source attribution', 'Cost-per-lead tracking', 'Conversion upload', 'Campaign ROI', 'Auto-tagging leads'],
      },
      {
        id: 'boldtrail',
        name: 'BoldTrail / kvCORE',
        logo: '🚀',
        status: 'available',
        tier: 'premium',
        description: 'Bi-directional sync with BoldTrail (formerly kvCORE) — import existing leads and activities.',
        requirements: ['BoldTrail/kvCORE account', 'API access from Settings → Integrations', 'Admin credentials'],
        envKeys: ['KVCORE_API_KEY', 'KVCORE_TEAM_ID'],
        docs: 'https://support.kvcore.com/hc/en-us/categories/api',
        capabilities: ['Lead import/export', 'Activity sync', 'Pipeline sync', 'Smart Campaign mapping', 'Tag migration'],
      },
      {
        id: 'sierra',
        name: 'Sierra Interactive',
        logo: '🏔️',
        status: 'available',
        tier: 'premium',
        description: 'Import and sync leads from Sierra Interactive — ideal for teams migrating to RealCRM.',
        requirements: ['Sierra Interactive account', 'API key from account settings', 'Lead export permission'],
        envKeys: ['SIERRA_API_KEY', 'SIERRA_SITE_ID'],
        docs: 'https://sierrainteractive.com/api',
        capabilities: ['Bulk lead import', 'Activity history import', 'Property alert sync', 'Tag mapping', 'Agent assignment'],
      },
    ],
  },
  {
    id: 'esign',
    label: 'E-Signature & Transactions',
    icon: FileText,
    color: 'yellow',
    description: 'Digital contracts, e-signatures, and transaction management',
    integrations: [
      {
        id: 'docusign',
        name: 'DocuSign',
        logo: '✍️',
        status: 'connected',
        tier: 'core',
        description: 'Industry-standard e-signature — send purchase agreements, listing agreements, and buyer rep docs from Back Office.',
        requirements: ['DocuSign account (free dev sandbox available)', 'Integration Key from Apps & Keys', 'RSA key pair for JWT auth', 'Production account for live sends'],
        envKeys: ['DOCUSIGN_INTEGRATION_KEY', 'DOCUSIGN_USER_ID', 'DOCUSIGN_ACCOUNT_ID', 'DOCUSIGN_PRIVATE_KEY'],
        docs: 'https://developers.docusign.com',
        capabilities: ['Send for e-signature', 'Status tracking in CRM', 'Audit trail', 'Template library', 'Bulk send', 'In-person signing'],
      },
      {
        id: 'dotloop',
        name: 'Dotloop',
        logo: '🔄',
        status: 'available',
        tier: 'standard',
        description: 'Full transaction management — create loops, share documents, track checklists, and collect e-signatures.',
        requirements: ['Dotloop account', 'API access (apply at dotloop.com/api)', 'OAuth 2.0 credentials'],
        envKeys: ['DOTLOOP_CLIENT_ID', 'DOTLOOP_CLIENT_SECRET', 'DOTLOOP_ACCESS_TOKEN'],
        docs: 'https://dotloop.github.io/public-api',
        capabilities: ['Loop creation from deal', 'Document upload', 'E-signature', 'Task checklists', 'MLS data pull', 'Compliance tracking'],
      },
      {
        id: 'skyslope',
        name: 'SkySlope',
        logo: '☁️',
        status: 'available',
        tier: 'premium',
        description: 'Broker compliance and transaction management. Auto-create SkySlope files when deals go Under Contract.',
        requirements: ['SkySlope brokerage account', 'API credentials from Settings', 'Broker admin setup'],
        envKeys: ['SKYSLOPE_API_KEY', 'SKYSLOPE_BROKERAGE_ID'],
        docs: 'https://skyslope.com/api',
        capabilities: ['Compliance checklists', 'Document storage', 'Broker review workflow', 'Commission tracking', 'E-sign', 'Audit log'],
      },
      {
        id: 'glide',
        name: 'Glide (Disclosures)',
        logo: '📋',
        status: 'available',
        tier: 'standard',
        description: 'California disclosure packages — auto-populate TDS, SPQ, and other CAR forms from deal data.',
        requirements: ['Glide account', 'API key', 'California transactions only'],
        envKeys: ['GLIDE_API_KEY', 'GLIDE_TEAM_ID'],
        docs: 'https://glide.com/api',
        capabilities: ['Disclosure generation', 'Seller questionnaires', 'CAR forms', 'E-signature', 'Audit trail'],
      },
      {
        id: 'authentisign',
        name: 'Authentisign / zipForm',
        logo: '📝',
        status: 'available',
        tier: 'standard',
        description: 'NAR-backed e-signature and forms platform used by thousands of agents. zipForm integration via Lone Wolf.',
        requirements: ['zipForm Plus subscription', 'Lone Wolf API access', 'State REALTOR® association membership'],
        envKeys: ['ZIPFORM_API_KEY', 'ZIPFORM_USERNAME', 'ZIPFORM_PASSWORD'],
        docs: 'https://lonewolftech.com/solutions/transactions',
        capabilities: ['CAR/state-specific forms', 'E-signature', 'Transaction folders', 'MLS auto-fill', 'Broker review'],
      },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing & Email Automation',
    icon: Mail,
    color: 'purple',
    description: 'Email campaigns, drip sequences, and marketing automation',
    integrations: [
      {
        id: 'mailchimp',
        name: 'Mailchimp',
        logo: '🐵',
        status: 'available',
        tier: 'standard',
        description: 'Sync leads to Mailchimp audiences. Trigger email campaigns when lead status changes.',
        requirements: ['Mailchimp account', 'API key from Account → Extras → API Keys', 'Audience (list) ID'],
        envKeys: ['MAILCHIMP_API_KEY', 'MAILCHIMP_LIST_ID'],
        docs: 'https://mailchimp.com/developer/marketing/api',
        capabilities: ['Lead sync to audience', 'Status-triggered campaigns', 'Tag mapping', 'Open/click tracking back to CRM', 'Unsubscribe sync'],
      },
      {
        id: 'activecampaign',
        name: 'ActiveCampaign',
        logo: '⚡',
        status: 'available',
        tier: 'standard',
        description: 'Powerful marketing automation — create automations that trigger on CRM events (new lead, status change, no contact).',
        requirements: ['ActiveCampaign account ($9+/mo)', 'API URL + API Key from Settings → Developer'],
        envKeys: ['ACTIVECAMPAIGN_URL', 'ACTIVECAMPAIGN_API_KEY'],
        docs: 'https://developers.activecampaign.com/reference',
        capabilities: ['Drip sequences', 'Status-triggered automations', 'Lead scoring sync', 'Deal pipeline sync', 'SMS integration', 'Site tracking'],
      },
      {
        id: 'zapier',
        name: 'Zapier',
        logo: '⚡',
        status: 'available',
        tier: 'standard',
        description: 'Connect RealCRM to 5,000+ apps via Zapier. No-code automation for any workflow.',
        requirements: ['Zapier account', 'RealCRM webhook URL', 'Zapier API key in target apps'],
        envKeys: ['ZAPIER_WEBHOOK_URL'],
        docs: 'https://zapier.com/developer',
        capabilities: ['Webhook triggers on lead events', 'Connect to any app', 'No-code workflow builder', 'Multi-step zaps', 'Filter + conditional logic'],
      },
      {
        id: 'follow_up_boss',
        name: 'Follow Up Boss (Sync)',
        logo: '🐂',
        status: 'available',
        tier: 'premium',
        description: 'Bi-directional sync for teams migrating from FUB — import leads, tags, notes, and call logs.',
        requirements: ['Follow Up Boss account', 'API key from Admin → API', 'Admin or owner role'],
        envKeys: ['FOLLOWUPBOSS_API_KEY'],
        docs: 'https://docs.followupboss.com/reference',
        capabilities: ['Lead import with history', 'Tag mapping', 'Note sync', 'Call log import', 'Pipeline stage mapping', 'Agent assignment'],
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Advertising',
    icon: BarChart2,
    color: 'indigo',
    description: 'Conversion tracking, ad attribution, and performance reporting',
    integrations: [
      {
        id: 'google_analytics',
        name: 'Google Analytics 4',
        logo: '📊',
        status: 'available',
        tier: 'standard',
        description: 'Track lead portal behavior — property views, search queries, time on site, conversion funnels.',
        requirements: ['Google Analytics 4 property', 'Measurement ID (G-XXXXXXX)', 'No code required — embed in portal'],
        envKeys: ['GA4_MEASUREMENT_ID', 'GA4_API_SECRET'],
        docs: 'https://developers.google.com/analytics',
        capabilities: ['Page view tracking', 'Event tracking (property view, search, inquiry)', 'Funnel analysis', 'Audience segments', 'Conversion reporting'],
      },
      {
        id: 'facebook_pixel',
        name: 'Facebook Pixel',
        logo: '📘',
        status: 'available',
        tier: 'standard',
        description: 'Retarget leads who viewed properties. Build lookalike audiences from closed buyers.',
        requirements: ['Facebook Business Manager', 'Pixel ID from Events Manager', 'Embed in IDX portal'],
        envKeys: ['FACEBOOK_PIXEL_ID'],
        docs: 'https://developers.facebook.com/docs/meta-pixel',
        capabilities: ['Property view events', 'Lead form events', 'Retargeting audiences', 'Lookalike audiences', 'Conversion API (server-side)'],
      },
      {
        id: 'google_tag_manager',
        name: 'Google Tag Manager',
        logo: '🏷️',
        status: 'available',
        tier: 'standard',
        description: 'Centralize all tracking pixels — deploy GA4, Facebook Pixel, CallRail, and more without code changes.',
        requirements: ['GTM account', 'Container ID (GTM-XXXXXX)', 'Embed snippet in portal'],
        envKeys: ['GTM_CONTAINER_ID'],
        docs: 'https://tagmanager.google.com',
        capabilities: ['Centralized tracking', 'No-code pixel deployment', 'Custom event triggers', 'A/B testing tags', 'Debug preview mode'],
      },
    ],
  },
  {
    id: 'productivity',
    label: 'Productivity & Calendar',
    icon: Calendar,
    color: 'teal',
    description: 'Calendar sync, scheduling, and team communication',
    integrations: [
      {
        id: 'google_workspace',
        name: 'Google Workspace',
        logo: '🔵',
        status: 'available',
        tier: 'standard',
        description: 'Sync tasks and follow-up reminders to Google Calendar. Log Gmail activity to lead profiles.',
        requirements: ['Google account or Workspace', 'OAuth 2.0 credentials', 'Enable Calendar API and Gmail API in Google Cloud Console'],
        envKeys: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'],
        docs: 'https://developers.google.com/workspace',
        capabilities: ['Calendar event sync', 'Gmail thread logging', 'Contact sync', 'Google Meet links in tasks', 'Drive document storage'],
      },
      {
        id: 'calendly',
        name: 'Calendly',
        logo: '📅',
        status: 'available',
        tier: 'standard',
        description: 'Auto-create CRM tasks and notes when leads book showing appointments via Calendly.',
        requirements: ['Calendly account', 'API key from Integrations → API', 'Webhook configured for booking events'],
        envKeys: ['CALENDLY_API_KEY', 'CALENDLY_WEBHOOK_URL'],
        docs: 'https://developer.calendly.com',
        capabilities: ['Booking → task creation', 'Lead profile note on book', 'Showing reminders', 'No-show tracking', 'Team round-robin'],
      },
      {
        id: 'slack',
        name: 'Slack',
        logo: '💬',
        status: 'available',
        tier: 'standard',
        description: 'Get real-time Slack alerts for hot lead activity, new assignments, and deal stage changes.',
        requirements: ['Slack workspace', 'Slack app with Incoming Webhooks enabled', 'Webhook URL from Slack App settings'],
        envKeys: ['SLACK_WEBHOOK_URL', 'SLACK_CHANNEL'],
        docs: 'https://api.slack.com/messaging/webhooks',
        capabilities: ['New lead alerts', 'Hot lead pings', 'Deal stage updates', 'Task due reminders', 'Daily digest'],
      },
      {
        id: 'outlook',
        name: 'Microsoft 365 / Outlook',
        logo: '📧',
        status: 'available',
        tier: 'standard',
        description: 'Sync leads with Outlook contacts, log emails to CRM, and push tasks to Microsoft To Do.',
        requirements: ['Microsoft 365 account', 'Azure App Registration', 'Microsoft Graph API permissions (Mail.Read, Calendars.ReadWrite, Contacts.ReadWrite)'],
        envKeys: ['MS_CLIENT_ID', 'MS_CLIENT_SECRET', 'MS_TENANT_ID'],
        docs: 'https://developer.microsoft.com/graph',
        capabilities: ['Outlook email logging', 'Calendar sync', 'Contact sync', 'Teams meeting links', 'To Do task sync'],
      },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Accounting',
    icon: DollarSign,
    color: 'emerald',
    description: 'Commission tracking, invoicing, and accounting integrations',
    integrations: [
      {
        id: 'quickbooks',
        name: 'QuickBooks Online',
        logo: '💰',
        status: 'available',
        tier: 'standard',
        description: 'Auto-create invoices and track commission income when deals close in the pipeline.',
        requirements: ['QuickBooks Online account', 'Intuit Developer account', 'OAuth 2.0 app credentials', 'Company ID'],
        envKeys: ['QB_CLIENT_ID', 'QB_CLIENT_SECRET', 'QB_COMPANY_ID', 'QB_REFRESH_TOKEN'],
        docs: 'https://developer.intuit.com/app/developer/qbo/docs',
        capabilities: ['Commission invoice creation', 'Income tracking by agent', 'Expense categorization', 'Profit & loss by deal', 'Tax report prep'],
      },
      {
        id: 'stripe',
        name: 'Stripe',
        logo: '💳',
        status: 'available',
        tier: 'standard',
        description: 'Collect transaction fees, referral fees, and retainer payments from clients via Stripe.',
        requirements: ['Stripe account', 'API keys from dashboard.stripe.com', 'Webhook endpoint configured'],
        envKeys: ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET'],
        docs: 'https://stripe.com/docs/api',
        capabilities: ['Payment links', 'Invoice collection', 'Subscription billing', 'ACH transfers', 'Payment status in CRM'],
      },
      {
        id: 'transactiondesk',
        name: 'TransactionDesk',
        logo: '📂',
        status: 'available',
        tier: 'premium',
        description: 'NAR-backed transaction management — auto-populate forms from CRM deal data.',
        requirements: ['TransactionDesk via state REALTOR® association', 'API access (contact TransactionDesk)', 'Board membership'],
        envKeys: ['TRANSACTIONDESK_API_KEY', 'TRANSACTIONDESK_USER_ID'],
        docs: 'https://transactiondesk.com',
        capabilities: ['Form auto-population', 'Transaction folders', 'Earnest money tracking', 'Commission disbursement', 'Audit log'],
      },
    ],
  },
  {
    id: 'data',
    label: 'Data & Compliance',
    icon: Database,
    color: 'gray',
    description: 'Data enrichment, scrubbing, compliance, and AI tools',
    integrations: [
      {
        id: 'clearbit',
        name: 'Clearbit Enrichment',
        logo: '🔍',
        status: 'available',
        tier: 'standard',
        description: 'Automatically enrich new leads — append company, social profiles, location, and buyer signals from email alone.',
        requirements: ['Clearbit account', 'API key from dashboard.clearbit.com', 'Email address required per lookup'],
        envKeys: ['CLEARBIT_API_KEY'],
        docs: 'https://dashboard.clearbit.com/docs',
        capabilities: ['Email → full profile', 'Company data', 'Social media links', 'Location data', 'Revenue estimates'],
      },
      {
        id: 'tcpa',
        name: 'TCPA Litigator Scrub',
        logo: '🛡️',
        status: 'available',
        tier: 'premium',
        description: 'Scrub phone numbers against TCPA litigator lists before every SMS or dial campaign. Avoid costly lawsuits.',
        requirements: ['TCPA Guardian or similar vendor account', 'API key', 'Run before any bulk SMS or dialer campaign'],
        envKeys: ['TCPA_API_KEY', 'TCPA_ACCOUNT_ID'],
        docs: 'https://tcpaguardian.com/api',
        capabilities: ['Phone scrubbing before campaigns', 'DNC list compliance', 'Wireless indicator', 'Litigator flagging', 'Compliance reports'],
      },
      {
        id: 'openai',
        name: 'OpenAI (AI Assistant)',
        logo: '🤖',
        status: 'available',
        tier: 'premium',
        description: 'Power AI-generated follow-up texts, email drafts, property summaries, and lead scoring explanations.',
        requirements: ['OpenAI account', 'API key from platform.openai.com', 'GPT-4 access recommended'],
        envKeys: ['OPENAI_API_KEY', 'OPENAI_MODEL'],
        docs: 'https://platform.openai.com/docs',
        capabilities: ['AI SMS drafting', 'Email copywriting', 'Property description generation', 'Lead summary', 'Sentiment analysis'],
      },
    ],
  },
];

const tierColors = {
  core:     'bg-blue-100 text-blue-700',
  standard: 'bg-gray-100 text-gray-600',
  premium:  'bg-purple-100 text-purple-700',
};

const colorMap = {
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    border: 'border-blue-200',   badge: 'bg-blue-600' },
  red:     { bg: 'bg-red-50',     icon: 'text-red-600',     border: 'border-red-200',    badge: 'bg-red-600' },
  green:   { bg: 'bg-green-50',   icon: 'text-green-600',   border: 'border-green-200',  badge: 'bg-green-600' },
  yellow:  { bg: 'bg-yellow-50',  icon: 'text-yellow-600',  border: 'border-yellow-200', badge: 'bg-yellow-600' },
  purple:  { bg: 'bg-purple-50',  icon: 'text-purple-600',  border: 'border-purple-200', badge: 'bg-purple-600' },
  indigo:  { bg: 'bg-indigo-50',  icon: 'text-indigo-600',  border: 'border-indigo-200', badge: 'bg-indigo-600' },
  teal:    { bg: 'bg-teal-50',    icon: 'text-teal-600',    border: 'border-teal-200',   badge: 'bg-teal-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-200',badge: 'bg-emerald-600' },
  gray:    { bg: 'bg-gray-50',    icon: 'text-gray-600',    border: 'border-gray-200',   badge: 'bg-gray-600' },
};

function IntegrationCard({ integration, catColor }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus]     = useState(integration.status);
  const [toggling, setToggling] = useState(false);
  const c = colorMap[catColor] || colorMap.gray;

  const toggle = () => {
    setToggling(true);
    setTimeout(() => {
      setStatus(s => s === 'connected' ? 'available' : 'connected');
      setToggling(false);
    }, 700);
  };

  return (
    <div className={`bg-white rounded-xl border ${status === 'connected' ? 'border-green-200 shadow-sm' : 'border-gray-200'} overflow-hidden transition-all`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${c.bg}`}>
            {integration.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-sm font-bold text-gray-900">{integration.name}</p>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tierColors[integration.tier]}`}>
                {integration.tier}
              </span>
              <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {status === 'connected' ? <CheckCircle size={9}/> : <XCircle size={9}/>}
                {status === 'connected' ? 'Connected' : 'Available'}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{integration.description}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => setExpanded(e => !e)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              {expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
            <button onClick={toggle} disabled={toggling}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                toggling ? 'bg-gray-100 text-gray-400' :
                status === 'connected' ? 'bg-red-50 text-red-600 hover:bg-red-100' :
                'bg-green-50 text-green-700 hover:bg-green-100'
              }`}>
              {toggling ? '...' : status === 'connected' ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
            {/* Capabilities */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Capabilities</p>
              <ul className="space-y-1.5">
                {integration.capabilities.map(cap => (
                  <li key={cap} className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle size={11} className="text-green-500 flex-shrink-0"/>
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
            {/* Setup */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Setup Requirements</p>
              <ul className="space-y-1.5 mb-3">
                {integration.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                    {req}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">ENV Keys</p>
              <div className="flex flex-wrap gap-1">
                {integration.envKeys.map(k => (
                  <code key={k} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{k}</code>
                ))}
              </div>
              {integration.docs && (
                <a href={integration.docs} target="_blank" rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <ExternalLink size={10}/>View Documentation
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Integrations() {
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const allIntegrations = CATEGORIES.flatMap(c => c.integrations);
  const totalConnected  = allIntegrations.filter(i => i.status === 'connected').length;
  const total           = allIntegrations.length;

  const filtered = (integrations) => integrations.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
    const matchTier   = !filterTier || i.tier === filterTier;
    const matchStatus = !filterStatus || i.status === filterStatus;
    return matchSearch && matchTier && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
        <p className="text-sm text-gray-500 mt-0.5">{totalConnected} of {total} integrations connected · 8 categories</p>
      </div>

      {/* 50K Leads Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Database size={20} className="text-white"/>
          </div>
          <div className="flex-1">
            <p className="font-bold text-base mb-1">✅ Ready for 50,000+ Leads</p>
            <p className="text-blue-100 text-sm leading-relaxed">
              RealCRM is architected for enterprise scale. The current demo runs <strong className="text-white">SQLite</strong> (local/dev).
              For production with 50K+ leads, a one-line swap to <strong className="text-white">PostgreSQL</strong> (via Railway, Supabase, or AWS RDS)
              handles millions of records with full-text search, indexes, and sub-100ms queries.
              Lead import via CSV, Zillow, Sierra, or kvCORE sync is supported out of the box.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['PostgreSQL ready','CSV bulk import','API lead sync','Indexed search','Pagination','Role-based access'].map(tag => (
                <span key={tag} className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Integrations', value: total, color: 'blue' },
          { label: 'Connected', value: totalConnected, color: 'green' },
          { label: 'Available', value: total - totalConnected, color: 'gray' },
          { label: 'Categories', value: CATEGORIES.length, color: 'purple' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search integrations..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"/>
        </div>
        <select value={filterTier} onChange={e => setFilterTier(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Tiers</option>
          <option value="core">Core</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Status</option>
          <option value="connected">Connected</option>
          <option value="available">Available</option>
        </select>
        {(search || filterTier || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterTier(''); setFilterStatus(''); }}
            className="text-xs text-blue-600 hover:underline">Clear</button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const c    = colorMap[cat.color] || colorMap.gray;
          const list = filtered(cat.integrations);
          if (list.length === 0) return null;
          return (
            <div key={cat.id}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg}`}>
                  <Icon size={16} className={c.icon}/>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{cat.label}</h2>
                  <p className="text-xs text-gray-400">{cat.description}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-gray-400">{cat.integrations.filter(i=>i.status==='connected').length}/{cat.integrations.length} connected</span>
                  <div className={`h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden`}>
                    <div className={`h-full ${c.badge} rounded-full`}
                      style={{ width: `${(cat.integrations.filter(i=>i.status==='connected').length / cat.integrations.length) * 100}%` }}/>
                  </div>
                </div>
              </div>

              {/* Integration Cards */}
              <div className="space-y-2">
                {list.map(int => (
                  <IntegrationCard key={int.id} integration={int} catColor={cat.color}/>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Tier Guide</p>
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <span className="bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full text-[10px] flex-shrink-0 mt-0.5">core</span>
            <span>Active in demo. Keys pre-configured. Ready to flip to production credentials.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full text-[10px] flex-shrink-0 mt-0.5">standard</span>
            <span>Fully built. Add ENV keys + flip Connect. No additional dev work required.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full text-[10px] flex-shrink-0 mt-0.5">premium</span>
            <span>Requires vendor approval or paid subscription. Architecture is complete — keys activate it.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
