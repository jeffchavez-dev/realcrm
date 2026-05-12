import React, { useState } from 'react';
import { FileText, Send, CheckCircle, Clock, AlertCircle, PenTool, Download, Eye, User, X, Printer } from 'lucide-react';

// ─── Template Content ────────────────────────────────────────────────────────

const TEMPLATE_CONTENT = {
  purchase: {
    title: 'RESIDENTIAL PURCHASE AND SALE AGREEMENT',
    subtitle: 'Maryland Standard Form — Residential Real Estate',
    sections: [
      {
        heading: '1. PARTIES',
        body: `BUYER(S): _________________________________ ("Buyer")
SELLER(S): _________________________________ ("Seller")
BROKERAGE: _________________________________ ("Brokerage")
LISTING AGENT: _________________________________ | License #: _________
BUYER'S AGENT: _________________________________ | License #: _________`,
      },
      {
        heading: '2. PROPERTY',
        body: `Property Address: _________________________________________________
City: _________________________ County: _________________ State: MD  Zip: _______
Legal Description / Parcel ID: _______________________________________________
The property includes all fixtures, built-in appliances, window treatments, and the following personal property: _____________________________________________`,
      },
      {
        heading: '3. PURCHASE PRICE & FINANCING',
        body: `Purchase Price: $_______________________ (_____________ Dollars)
Earnest Money Deposit: $_____________ due within _____ days of acceptance
Method of Financing:  ☐ Conventional  ☐ FHA  ☐ VA  ☐ USDA  ☐ Cash
Loan Amount: $________________  Interest Rate: not to exceed ______%
Financing Contingency Deadline: ___________________________`,
      },
      {
        heading: '4. CONTINGENCIES',
        body: `☐ Financing Contingency — Buyer to obtain written loan commitment by: __________
☐ Home Inspection Contingency — Inspection to be completed within _____ days
☐ Appraisal Contingency — Property must appraise at or above purchase price
☐ Sale of Buyer's Property — Address: ____________________________________
☐ Other: _______________________________________________________________`,
      },
      {
        heading: '5. SETTLEMENT & POSSESSION',
        body: `Settlement Date (Target): _________________________
Settlement Agent / Title Company: _______________________________________
Possession: ☐ At Settlement  ☐ _____ days after Settlement
Pro-rations for taxes, HOA dues, and utilities shall be calculated as of Settlement Date.`,
      },
      {
        heading: '6. INCLUSIONS & EXCLUSIONS',
        body: `Included in Sale: All permanently installed fixtures, HVAC systems, water heater, garage door openers, ceiling fans, existing window treatments.
Excluded from Sale: ___________________________________________________
Home Warranty: ☐ Seller to provide $___________ home warranty  ☐ N/A`,
      },
      {
        heading: '7. DEFAULT & DISPUTE RESOLUTION',
        body: `If Buyer defaults, Seller may retain the Earnest Money as liquidated damages. If Seller defaults, Buyer may seek specific performance or return of deposit. Any disputes shall first be submitted to mediation before litigation.`,
      },
      {
        heading: '8. SIGNATURES',
        body: `By signing below, the parties agree to all terms set forth in this Agreement.

BUYER: ___________________________ Date: __________
BUYER: ___________________________ Date: __________
SELLER: __________________________ Date: __________
SELLER: __________________________ Date: __________

Listing Agent: ____________________ Date: __________
Buyer's Agent: ___________________ Date: __________`,
      },
    ],
  },

  listing: {
    title: 'EXCLUSIVE RIGHT TO SELL LISTING AGREEMENT',
    subtitle: 'Maryland — Exclusive Right to Sell',
    sections: [
      {
        heading: '1. PARTIES & PROPERTY',
        body: `SELLER(S): _________________________________ ("Seller")
BROKERAGE: _________________________________ ("Broker")
LISTING AGENT: _________________________________ | MD License #: _________
Property Address: _________________________________________________
City: _________________________ County: _________________ State: MD  Zip: _______
Legal Description: _______________________________________________`,
      },
      {
        heading: '2. LISTING TERM',
        body: `This Agreement begins on: _________________________
This Agreement expires on: _________________________  (not less than 30 days)
If property is under contract at expiration, Agreement extends through closing.
Extension clause: ☐ Yes — 180-day protection period after expiration for Broker-introduced buyers  ☐ No`,
      },
      {
        heading: '3. LIST PRICE & COMMISSION',
        body: `List Price: $_______________________ (subject to Seller's approval to change)
Total Commission: ______% of gross sale price
Cooperating Buyer's Agent Commission: ______%
Minimum Net to Seller: $_________________ (if applicable)
Seller agrees to pay commission if property is sold, exchanged, or otherwise transferred during the Listing Term.`,
      },
      {
        heading: '4. BROKER AUTHORITY & MARKETING',
        body: `Seller authorizes Broker to:
✓ Place property on Bright MLS and all syndication partners (Zillow, Realtor.com, etc.)
✓ Install a "For Sale" yard sign
✓ Install a lockbox — Type: ☐ Electronic (Supra)  ☐ Combination  ☐ None
✓ Conduct open houses: ☐ Approved  ☐ Not Approved
✓ Photograph and create virtual tour content
✓ Market via email, social media, and direct mail
MLS Entry: ☐ Immediate  ☐ Office Exclusive (max 5 days before Bright MLS)`,
      },
      {
        heading: '5. SELLER REPRESENTATIONS',
        body: `Seller represents that:
• Seller has full authority to sell the property
• There are no undisclosed liens, encumbrances, or judgments beyond those stated
• Seller Disclosure Statement will be completed accurately and in full
• HOA: ☐ Yes — Name: ___________________ Monthly Fee: $_______  ☐ No
• Current Tenant: ☐ Yes — Lease expires: ___________  ☐ No`,
      },
      {
        heading: '6. BROKER OBLIGATIONS',
        body: `Broker agrees to:
• Submit property to Bright MLS within 1 business day of listing (unless office exclusive)
• Provide Seller with written marketing plan within 5 days of signing
• Present all offers to Seller promptly regardless of commission offered
• Provide monthly activity reports (showings, feedback, market updates)
• Comply with all Fair Housing laws and regulations`,
      },
      {
        heading: '7. SIGNATURES',
        body: `SELLER: ___________________________ Date: __________
SELLER: ___________________________ Date: __________

Listing Agent: ____________________ Date: __________
Broker/Owner: _________________________________ Date: __________`,
      },
    ],
  },

  'buyer-rep': {
    title: 'BUYER REPRESENTATION AGREEMENT',
    subtitle: 'Exclusive Buyer Agency Agreement',
    sections: [
      {
        heading: '1. PARTIES',
        body: `BUYER(S): _________________________________ ("Buyer")
BROKERAGE: _________________________________ ("Broker")
BUYER'S AGENT: _________________________________ | MD License #: _________
This Agreement is entered into as of: _________________________`,
      },
      {
        heading: '2. SCOPE OF REPRESENTATION',
        body: `Broker agrees to represent Buyer exclusively in the purchase of residential real property located in:
Counties / Areas: ☐ St. Mary's  ☐ Calvert  ☐ Charles  ☐ Other: _____________
Property Type: ☐ Single-Family  ☐ Townhome  ☐ Condo  ☐ New Construction  ☐ Any
Price Range: $________________ to $________________
Term of Agreement: From _________________ to _________________`,
      },
      {
        heading: '3. BUYER AGENT COMPENSATION',
        body: `Compensation Source: ☐ Paid by Seller/Listing Broker  ☐ Paid by Buyer  ☐ Combination
If paid by Seller/Listing Broker: Broker will seek ______% from the listing brokerage.
If Seller offers less than ______%, Buyer agrees to pay the difference.
If Buyer purchases a For-Sale-By-Owner property: Buyer agrees to pay Broker ______% of the purchase price.
Flat fee alternative: $_________________ (if applicable)`,
      },
      {
        heading: '4. BROKER DUTIES TO BUYER',
        body: `Broker agrees to:
✓ Perform a diligent search for properties matching Buyer's criteria
✓ Provide Buyer with all material facts known about each property
✓ Assist Buyer in evaluating properties, preparing offers, and negotiating
✓ Refer Buyer to other professionals (inspectors, lenders, attorneys) as needed
✓ Maintain confidentiality of Buyer's financial position and motivation
✓ Present all properties regardless of MLS commission offered`,
      },
      {
        heading: '5. BUYER OBLIGATIONS',
        body: `Buyer agrees to:
• Work exclusively with Broker during the term of this Agreement
• Provide Broker with accurate financial information and pre-approval letters
• Inform Broker immediately of direct contact by other licensees or sellers
• Notify Broker of any property of interest discovered independently
• Obtain mortgage pre-approval within _____ days of signing this Agreement
Pre-approved Lender: _________________________________ Amount: $_____________`,
      },
      {
        heading: '6. SIGNATURES',
        body: `BUYER: ___________________________ Date: __________
BUYER: ___________________________ Date: __________

Buyer's Agent: ___________________ Date: __________
Broker/Owner: _________________________________ Date: __________`,
      },
    ],
  },

  disclosure: {
    title: 'MARYLAND RESIDENTIAL PROPERTY DISCLOSURE STATEMENT',
    subtitle: 'Required by Maryland Code, Real Property Article §10-702',
    sections: [
      {
        heading: 'SELLER INFORMATION',
        body: `Property Address: _________________________________________________
Seller Name(s): _________________________________
Seller has owned property since: _________________
Seller has occupied property: ☐ Yes — Last occupied: _______  ☐ Never occupied`,
      },
      {
        heading: '1. WATER & SEWER',
        body: `Water Source: ☐ Public/Municipal  ☐ Well  ☐ Other: _____________
If Well — Date last tested: _________ Results: ☐ Pass  ☐ Fail  ☐ Unknown
Sewer: ☐ Public/Municipal  ☐ Septic System
If Septic — Last pumped: _________ Known issues: ☐ Yes (explain): ___________  ☐ No`,
      },
      {
        heading: '2. STRUCTURAL & MECHANICAL',
        body: `Foundation Type: ☐ Poured Concrete  ☐ Block  ☐ Crawl Space  ☐ Slab  ☐ Other
Known defects in roof, walls, foundation, floors: ☐ Yes (explain): ______________  ☐ No
Age of Roof: _________ years  Known leaks: ☐ Yes  ☐ No  ☐ Repaired: _________
HVAC — Heating System: ________________ Age: _____ Known issues: ☐ Yes  ☐ No
HVAC — Cooling System: ________________ Age: _____ Known issues: ☐ Yes  ☐ No
Water Heater: Type: ____________ Age: _____ Known issues: ☐ Yes  ☐ No`,
      },
      {
        heading: '3. ENVIRONMENTAL',
        body: `Lead Paint: Property built before 1978? ☐ Yes  ☐ No
  If Yes — Known lead paint: ☐ Yes  ☐ No  (Federal Lead Disclosure attached if applicable)
Asbestos: ☐ Known presence  ☐ No known presence  ☐ Unknown
Radon: Tested? ☐ Yes — Level: _______ pCi/L  ☐ No
Underground Storage Tanks: ☐ Yes (status): _____________  ☐ No  ☐ Unknown
Mold / Water Intrusion (past or present): ☐ Yes (explain): ___________________  ☐ No`,
      },
      {
        heading: '4. LEGAL & HOA',
        body: `Zoning Classification: _____________  Known zoning violations: ☐ Yes  ☐ No
Open permits: ☐ Yes (describe): _____________________  ☐ No
HOA: ☐ Yes — Name: _________________ Monthly: $_______ Transfer fee: $_______
       CC&Rs provided: ☐ Yes  ☐ Buyer to obtain
Flood Zone: ☐ Yes — Zone: _______  ☐ No  Flood insurance required: ☐ Yes  ☐ No
Easements or encroachments: ☐ Yes (describe): ____________________  ☐ No`,
      },
      {
        heading: '5. ADDITIONAL DISCLOSURES & SIGNATURES',
        body: `Additional known material defects not listed above:
_________________________________________________________________
_________________________________________________________________

Seller certifies that the information above is accurate and complete to the best of Seller's knowledge.

SELLER: ___________________________ Date: __________
SELLER: ___________________________ Date: __________

Buyer acknowledges receipt of this Disclosure Statement:
BUYER: ___________________________ Date: __________
BUYER: ___________________________ Date: __________`,
      },
    ],
  },

  addendum: {
    title: 'CONTRACT ADDENDUM',
    subtitle: 'Addendum to Residential Purchase Agreement',
    sections: [
      {
        heading: 'REFERENCE TO ORIGINAL CONTRACT',
        body: `This Addendum is attached to and made a part of the Purchase Agreement dated: _________________________
Property Address: _________________________________________________
Buyer(s): _________________________________
Seller(s): _________________________________
This Addendum modifies the terms of the original Contract as stated below. In the event of any conflict between this Addendum and the original Contract, the terms of this Addendum shall control.`,
      },
      {
        heading: 'MODIFICATION 1',
        body: `Section / Paragraph Affected: _____________________
Original Term: ___________________________________________________
Revised Term: ___________________________________________________
Effective Date of Change: _________________________`,
      },
      {
        heading: 'MODIFICATION 2 (if applicable)',
        body: `Section / Paragraph Affected: _____________________
Original Term: ___________________________________________________
Revised Term: ___________________________________________________
Effective Date of Change: _________________________`,
      },
      {
        heading: 'MODIFICATION 3 (if applicable)',
        body: `Section / Paragraph Affected: _____________________
Original Term: ___________________________________________________
Revised Term: ___________________________________________________
Effective Date of Change: _________________________`,
      },
      {
        heading: 'ALL OTHER TERMS REMAIN',
        body: `Except as modified by this Addendum, all other terms and conditions of the original Purchase Agreement remain in full force and effect. Both parties confirm they have read and agree to this Addendum.

BUYER: ___________________________ Date: __________
BUYER: ___________________________ Date: __________
SELLER: __________________________ Date: __________
SELLER: __________________________ Date: __________

Listing Agent: ____________________ Date: __________
Buyer's Agent: ___________________ Date: __________`,
      },
    ],
  },

  lease: {
    title: 'RESIDENTIAL LEASE AGREEMENT (ONE YEAR)',
    subtitle: 'Maryland Residential Lease',
    sections: [
      {
        heading: '1. PARTIES & PREMISES',
        body: `LANDLORD: _________________________________ ("Landlord")
TENANT(S): _________________________________ ("Tenant")
Managed by: _________________________________
Rental Property Address: _________________________________________________
City: _________________________ County: _________________ MD  Zip: _______
Unit Type: ☐ Single-Family  ☐ Townhome  ☐ Apartment  ☐ Condo  Beds: ___ Baths: ___`,
      },
      {
        heading: '2. LEASE TERM & RENT',
        body: `Lease Start Date: _________________________
Lease End Date: _________________________  (12 months)
Monthly Rent: $_______________________ due on the 1st of each month
Grace Period: 5 days — Late fee after grace period: $_________ or ______% of monthly rent
Acceptable Payment Methods: ☐ Check  ☐ ACH/Bank Transfer  ☐ Online Portal
Make checks payable to: _________________________________`,
      },
      {
        heading: '3. SECURITY DEPOSIT',
        body: `Security Deposit Amount: $_______________________ (not to exceed 2 months' rent per MD law)
Deposit held at: _________________________________  Account #: _____________
Maryland law requires return of deposit within 45 days of lease end, less lawful deductions.
Pet Deposit (if applicable): $_____________  Non-refundable pet fee: $_____________`,
      },
      {
        heading: '4. UTILITIES & SERVICES',
        body: `Tenant Responsible For: ☐ Electric  ☐ Gas  ☐ Water/Sewer  ☐ Trash  ☐ Internet  ☐ Cable
Landlord Responsible For: ☐ Water/Sewer  ☐ Trash  ☐ Lawn Care  ☐ Snow Removal  ☐ Other: _______
Lawn Care: ☐ Tenant  ☐ Landlord  Snow Removal: ☐ Tenant  ☐ Landlord`,
      },
      {
        heading: '5. OCCUPANTS, PETS & RULES',
        body: `Authorized Occupants (name all adults): _________________________________
Pets: ☐ Permitted (type/breed/weight): _______________________  ☐ Not Permitted
Smoking: ☐ Permitted outdoors only  ☐ Not permitted on premises
Maximum number of vehicles: _____  Assigned parking space(s): _____________
Tenant shall not sublease without written consent of Landlord.`,
      },
      {
        heading: '6. MAINTENANCE & REPAIRS',
        body: `Tenant agrees to:
• Keep premises clean and in good repair
• Report maintenance issues within 48 hours of discovery
• Not make alterations without written Landlord approval
• Replace all light bulbs, smoke detector batteries, and HVAC filters
Landlord agrees to:
• Maintain premises in habitable condition per Maryland law
• Respond to emergency repairs within 24 hours
• Provide 24-hour notice before non-emergency entry (except emergencies)
Maintenance Request Line: _________________ Emergency: _________________`,
      },
      {
        heading: '7. RENEWAL, TERMINATION & HOLDOVER',
        body: `Lease Renewal: Either party must provide written notice of non-renewal at least 60 days prior to expiration.
Early Termination by Tenant: 60-day written notice required + early termination fee equal to _____ month(s) rent.
Early Termination by Landlord: Required by Maryland law only for non-payment, lease violation, or property sale.
Holdover Tenancy: If Tenant remains after lease end without renewal, lease converts to month-to-month at 110% of monthly rent.`,
      },
      {
        heading: '8. SIGNATURES',
        body: `By signing, Tenant acknowledges reading and agreeing to all terms of this Lease Agreement.

TENANT: ___________________________ Date: __________
TENANT: ___________________________ Date: __________

LANDLORD / AGENT: ________________ Date: __________
Property Manager: _________________________________ Date: __________`,
      },
    ],
  },
};

// ─── Template List ────────────────────────────────────────────────────────────

const TEMPLATES = [
  { id: 'purchase',   name: 'Purchase Agreement',        pages: 12, category: 'Transaction', description: 'Standard residential purchase and sale agreement with contingencies.' },
  { id: 'listing',    name: 'Listing Agreement',          pages: 8,  category: 'Listing',     description: 'Exclusive right-to-sell listing agreement with commission terms.' },
  { id: 'buyer-rep',  name: 'Buyer Representation',       pages: 5,  category: 'Buyer',       description: 'Buyer agency agreement establishing representation terms.' },
  { id: 'disclosure', name: 'Seller Disclosure',          pages: 6,  category: 'Disclosure',  description: 'Maryland/Virginia residential property disclosure form.' },
  { id: 'addendum',   name: 'Contract Addendum',          pages: 3,  category: 'Transaction', description: 'General addendum for modifying contract terms.' },
  { id: 'lease',      name: 'Lease Agreement (1 Year)',   pages: 14, category: 'Rental',      description: 'Residential lease agreement with standard clauses.' },
];

const CATEGORY_COLORS = {
  Transaction: 'bg-blue-50 text-blue-700',
  Listing:     'bg-purple-50 text-purple-700',
  Buyer:       'bg-green-50 text-green-700',
  Disclosure:  'bg-orange-50 text-orange-700',
  Rental:      'bg-teal-50 text-teal-700',
};

const STATUS_CONFIG = {
  sent:     { label: 'Awaiting Signature', icon: Clock,       color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  signed:   { label: 'Completed',          icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  declined: { label: 'Declined',           icon: AlertCircle, color: 'text-red-600 bg-red-50 border-red-200' },
  draft:    { label: 'Draft',              icon: FileText,    color: 'text-gray-600 bg-gray-50 border-gray-200' },
};

const DEMO_ACTIVITY = [
  { id:1, doc:'Purchase Agreement',   recipient:'Marcus Thompson',   email:'m.thompson@email.com',  status:'signed', sent:'2026-05-06', completed:'2026-05-07', envelope:'ENV-2026-0412' },
  { id:2, doc:'Listing Agreement',    recipient:'Sandra Williams',   email:'s.williams@email.com',  status:'sent',   sent:'2026-05-07', completed:null,          envelope:'ENV-2026-0413' },
  { id:3, doc:'Buyer Representation', recipient:'James & Carol Lee', email:'jclee@email.com',        status:'signed', sent:'2026-05-05', completed:'2026-05-05', envelope:'ENV-2026-0410' },
  { id:4, doc:'Seller Disclosure',    recipient:'Robert Martinez',   email:'r.martinez@email.com',  status:'sent',   sent:'2026-05-08', completed:null,          envelope:'ENV-2026-0414' },
  { id:5, doc:'Contract Addendum',    recipient:'Emily Davis',       email:'e.davis@email.com',     status:'signed', sent:'2026-05-04', completed:'2026-05-04', envelope:'ENV-2026-0408' },
];

// ─── Document Preview Modal ───────────────────────────────────────────────────

function DocPreviewModal({ template, onClose }) {
  const content = TEMPLATE_CONTENT[template.id];
  if (!content) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={16} className="text-white"/>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{template.name}</p>
              <p className="text-xs text-gray-400">{template.pages} pages · Draft Template</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload(template)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={13}/> Download
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={16}/>
            </button>
          </div>
        </div>

        {/* Document body */}
        <div className="overflow-y-auto flex-1 bg-gray-50 p-6">
          <div className="max-w-2xl mx-auto bg-white shadow-sm rounded-xl border border-gray-200 p-8">
            {/* Doc header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-900">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Real Estate Document Template</p>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide leading-snug">{content.title}</h2>
              <p className="text-xs text-gray-500 mt-1">{content.subtitle}</p>
            </div>

            {/* Sections */}
            <div className="space-y-7">
              {content.sections.map((sec, i) => (
                <div key={i}>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 pb-1 border-b border-gray-200">
                    {sec.heading}
                  </h3>
                  <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                    {sec.body}
                  </pre>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <p className="text-[10px] text-gray-400">
                DRAFT TEMPLATE — For demonstration and customization purposes only
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                This document is for informational purposes. Consult a licensed Maryland real estate attorney for legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Download helper (plain-text file) ───────────────────────────────────────

function handleDownload(template) {
  const content = TEMPLATE_CONTENT[template.id];
  if (!content) return;

  const lines = [
    '='.repeat(70),
    content.title,
    content.subtitle,
    'Real Estate Document Template',
    '='.repeat(70),
    '',
    ...content.sections.flatMap(sec => [
      sec.heading,
      '-'.repeat(sec.heading.length),
      sec.body,
      '',
    ]),
    '='.repeat(70),
    'DRAFT TEMPLATE — For demonstration and customization purposes only.',
    'Consult a licensed Maryland real estate attorney for legal advice.',
    '='.repeat(70),
  ];

  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${template.id}-template.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BackOffice() {
  const [selected, setSelected]   = useState(null);
  const [recipient, setRecipient] = useState({ name:'', email:'' });
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [activity, setActivity]   = useState(DEMO_ACTIVITY);
  const [activeTab, setActiveTab] = useState('templates');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handleSend = async () => {
    if (!selected || !recipient.name || !recipient.email) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1800));
    const newEnv = {
      id: activity.length + 1,
      doc: TEMPLATES.find(t => t.id === selected)?.name,
      recipient: recipient.name,
      email: recipient.email,
      status: 'sent',
      sent: new Date().toISOString().split('T')[0],
      completed: null,
      envelope: 'ENV-2026-0' + (415 + activity.length),
    };
    setActivity(a => [newEnv, ...a]);
    setSending(false);
    setSent(true);
    setTimeout(() => { setSent(false); setSelected(null); setRecipient({ name:'', email:'' }); }, 3000);
  };

  const stats = {
    total:     activity.length,
    awaiting:  activity.filter(a => a.status === 'sent').length,
    completed: activity.filter(a => a.status === 'signed').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Preview Modal */}
      {previewTemplate && (
        <DocPreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Back Office · E-Sign</h1>
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/>DocuSign Ready
            </span>
          </div>
          <p className="text-sm text-gray-500">Send, track and manage real estate documents for e-signature</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <PenTool size={16} className="text-yellow-500"/>
          <div>
            <p className="text-xs font-bold text-gray-800">DocuSign</p>
            <p className="text-[10px] text-gray-400">E-Signature Platform</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total Sent',          value: stats.total,     icon: Send,        color:'blue' },
          { label:'Awaiting Signature',  value: stats.awaiting,  icon: Clock,       color:'yellow' },
          { label:'Completed',           value: stats.completed, icon: CheckCircle, color:'green' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}-50`}>
              <Icon size={18} className={`text-${color}-600`}/>
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[['templates','Document Templates'],['activity','Activity Log']].map(([k,l]) => (
          <button key={k} onClick={() => setActiveTab(k)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab===k ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {l}
          </button>
        ))}
      </div>

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template List */}
          <div className="lg:col-span-2 space-y-3">
            {TEMPLATES.map(t => (
              <div key={t.id} onClick={() => { setSelected(t.id); setSent(false); }}
                className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-sm ${selected===t.id ? 'border-blue-500 shadow-sm' : 'border-gray-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selected===t.id ? 'bg-blue-600' : 'bg-gray-100'}`}>
                    <FileText size={18} className={selected===t.id ? 'text-white' : 'text-gray-500'}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[t.category]}`}>{t.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{t.description}</p>
                    <p className="text-xs text-gray-400">{t.pages} pages · PDF Template</p>
                  </div>

                  {/* Eye + Download buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={e => { e.stopPropagation(); setPreviewTemplate(t); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Preview document"
                    >
                      <Eye size={14}/>
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDownload(t); }}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download template"
                    >
                      <Download size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Send Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Send size={16} className="text-blue-600"/> Send for Signature
              </h3>

              {!selected ? (
                <div className="text-center py-8 text-gray-400">
                  <FileText size={32} className="mx-auto mb-2 opacity-40"/>
                  <p className="text-sm">Select a document template to send</p>
                </div>
              ) : sent ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={28} className="text-green-600"/>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Envelope Sent!</p>
                  <p className="text-xs text-gray-500">{recipient.name} will receive a DocuSign email shortly</p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 rounded-xl p-3 mb-4">
                    <p className="text-xs font-semibold text-blue-700 mb-0.5">Selected Document</p>
                    <p className="text-sm font-medium text-blue-900">{TEMPLATES.find(t=>t.id===selected)?.name}</p>
                    <p className="text-xs text-blue-600">{TEMPLATES.find(t=>t.id===selected)?.pages} pages</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Recipient Name</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input value={recipient.name} onChange={e => setRecipient(r=>({...r,name:e.target.value}))}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Client full name"/>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email Address</label>
                      <div className="relative">
                        <Send size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type="email" value={recipient.email} onChange={e => setRecipient(r=>({...r,email:e.target.value}))}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="client@email.com"/>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSend} disabled={sending || !recipient.name || !recipient.email}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {sending ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Sending via DocuSign...</>
                    ) : (
                      <><PenTool size={15}/> Send for E-Signature</>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-400 text-center mt-3">
                    Powered by DocuSign · Legally binding e-signature
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Document','Recipient','Status','Date Sent','Envelope ID'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activity.map(a => {
                const cfg  = STATUS_CONFIG[a.status];
                const Icon = cfg.icon;
                return (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-gray-400"/>
                        <span className="text-sm font-medium text-gray-900">{a.doc}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-900">{a.recipient}</p>
                      <p className="text-xs text-gray-400">{a.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                        <Icon size={11}/> {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{a.sent}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{a.envelope}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
