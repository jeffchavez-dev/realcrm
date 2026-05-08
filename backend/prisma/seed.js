const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RealCRM database...');

  // ── AGENTS ────────────────────────────────────────────────────────
  const agents = await Promise.all([
    prisma.agent.upsert({ where:{ email:'sarah.johnson@realcrm.com' }, update:{}, create:{ name:'Sarah Johnson', email:'sarah.johnson@realcrm.com', phone:'(202) 555-0101', role:'Manager', status:'Active', capLimit:16000, capCurrent:12400 }}),
    prisma.agent.upsert({ where:{ email:'marcus.lee@realcrm.com' }, update:{}, create:{ name:'Marcus Lee', email:'marcus.lee@realcrm.com', phone:'(202) 555-0102', role:'Agent', status:'Active', capLimit:16000, capCurrent:8200 }}),
    prisma.agent.upsert({ where:{ email:'diana.chen@realcrm.com' }, update:{}, create:{ name:'Diana Chen', email:'diana.chen@realcrm.com', phone:'(202) 555-0103', role:'Agent', status:'Active', capLimit:16000, capCurrent:5600 }}),
    prisma.agent.upsert({ where:{ email:'james.rivera@realcrm.com' }, update:{}, create:{ name:'James Rivera', email:'james.rivera@realcrm.com', phone:'(202) 555-0104', role:'ISA', status:'Active', capLimit:16000, capCurrent:1800 }}),
    prisma.agent.upsert({ where:{ email:'priya.patel@realcrm.com' }, update:{}, create:{ name:'Priya Patel', email:'priya.patel@realcrm.com', phone:'(202) 555-0105', role:'Agent', status:'Active', capLimit:16000, capCurrent:9750 }}),
  ]);

  const [sarah, marcus, diana, james, priya] = agents;

  // ── INTEGRATIONS ──────────────────────────────────────────────────
  await prisma.integration.upsert({ where:{ name:'mls' }, update:{}, create:{ name:'mls', label:'BRIGHT MLS (RealTNA)', status:'disconnected', config:'{"provider":"realtna","market":"BRIGHT","boards":["MRIS","BrightMLS"]}' }});
  await prisma.integration.upsert({ where:{ name:'twilio' }, update:{}, create:{ name:'twilio', label:'Twilio (Calls + SMS)', status:'disconnected', config:'{"smsEnabled":true,"callEnabled":true,"recordCalls":false}' }});
  await prisma.integration.upsert({ where:{ name:'docusign' }, update:{}, create:{ name:'docusign', label:'DocuSign (E-Sign)', status:'disconnected', config:'{"environment":"demo","templateIds":[]}' }});
  await prisma.integration.upsert({ where:{ name:'google_ads' }, update:{}, create:{ name:'google_ads', label:'Google Ads (PPC Tracking)', status:'disconnected', config:'{"conversionTracking":true,"autoTagging":true}' }});

  // ── LEADS (fixed IDs so notifications never break across deploys) ──
  const leadsData = [
    { id:'lead-michael-thompson', firstName:'Michael', lastName:'Thompson', email:'m.thompson@gmail.com', phone:'(240) 555-0201', source:'Google PPC', status:'Hot', score:87, temperature:'Hot', budget:650000, preApproved:true, timeline:'1-3 months', agentId:sarah.id, tags:'buyer,pre-approved,urgent', lastContact: new Date(Date.now() - 1*24*60*60*1000) },
    { id:'lead-jennifer-walsh',   firstName:'Jennifer', lastName:'Walsh', email:'jen.walsh@outlook.com', phone:'(301) 555-0202', source:'Upnest', status:'Nurturing', score:64, temperature:'Warm', budget:420000, preApproved:false, timeline:'3-6 months', agentId:marcus.id, tags:'buyer,first-time', lastContact: new Date(Date.now() - 3*24*60*60*1000) },
    { id:'lead-robert-kim',       firstName:'Robert', lastName:'Kim', email:'r.kim@yahoo.com', phone:'(703) 555-0203', source:'Facebook', status:'Contacted', score:45, temperature:'Warm', budget:525000, preApproved:false, timeline:'6-12 months', agentId:diana.id, tags:'buyer,relocating', lastContact: new Date(Date.now() - 5*24*60*60*1000) },
    { id:'lead-amanda-foster',    firstName:'Amanda', lastName:'Foster', email:'afoster@gmail.com', phone:'(202) 555-0204', source:'Referral', status:'Hot', score:92, temperature:'Hot', budget:875000, preApproved:true, timeline:'Immediately', agentId:priya.id, tags:'buyer,luxury,pre-approved', lastContact: new Date(Date.now() - 0.5*24*60*60*1000) },
    { id:'lead-david-martinez',   firstName:'David', lastName:'Martinez', email:'d.martinez@gmail.com', phone:'(240) 555-0205', source:'Google PPC', status:'New', score:22, temperature:'Cold', budget:380000, preApproved:false, timeline:'12+ months', agentId:james.id, tags:'buyer', lastContact: null },
    { id:'lead-lisa-anderson',    firstName:'Lisa', lastName:'Anderson', email:'lisa.a@gmail.com', phone:'(301) 555-0206', source:'Homelight', status:'Nurturing', score:58, temperature:'Warm', budget:495000, preApproved:false, timeline:'3-6 months', agentId:marcus.id, tags:'seller,buyer', lastContact: new Date(Date.now() - 7*24*60*60*1000) },
    { id:'lead-kevin-brown',      firstName:'Kevin', lastName:'Brown', email:'k.brown@gmail.com', phone:'(571) 555-0207', source:'FastExpert', status:'Contacted', score:39, temperature:'Cold', budget:310000, preApproved:false, timeline:'6-12 months', agentId:diana.id, tags:'buyer,first-time', lastContact: new Date(Date.now() - 4*24*60*60*1000) },
    { id:'lead-sandra-wilson',    firstName:'Sandra', lastName:'Wilson', email:'s.wilson@hotmail.com', phone:'(202) 555-0208', source:'Sphere', status:'Under Contract', score:95, temperature:'Hot', budget:720000, preApproved:true, timeline:'Immediately', agentId:sarah.id, tags:'buyer,under-contract', lastContact: new Date(Date.now() - 1*24*60*60*1000) },
    { id:'lead-carlos-hernandez', firstName:'Carlos', lastName:'Hernandez', email:'carlos.h@gmail.com', phone:'(703) 555-0209', source:'Google PPC', status:'New', score:18, temperature:'Cold', budget:null, preApproved:false, timeline:'12+ months', agentId:james.id, tags:'buyer', lastContact: null },
    { id:'lead-patricia-moore',   firstName:'Patricia', lastName:'Moore', email:'p.moore@gmail.com', phone:'(240) 555-0210', source:'Facebook', status:'Nurturing', score:71, temperature:'Warm', budget:560000, preApproved:true, timeline:'1-3 months', agentId:priya.id, tags:'buyer,pre-approved', lastContact: new Date(Date.now() - 2*24*60*60*1000) },
    { id:'lead-thomas-jackson',   firstName:'Thomas', lastName:'Jackson', email:'tj@gmail.com', phone:'(301) 555-0211', source:'Upnest', status:'New', score:31, temperature:'Cold', budget:445000, preApproved:false, timeline:'6-12 months', agentId:james.id, tags:'buyer', lastContact: null },
    { id:'lead-nancy-davis',      firstName:'Nancy', lastName:'Davis', email:'nancy.d@gmail.com', phone:'(202) 555-0212', source:'Referral', status:'Hot', score:83, temperature:'Hot', budget:610000, preApproved:true, timeline:'1-3 months', agentId:sarah.id, tags:'seller,buyer,pre-approved', lastContact: new Date(Date.now() - 1*24*60*60*1000) },
  ];

  const leads = [];
  for (const ld of leadsData) {
    const { id, ...data } = ld;
    const lead = await prisma.lead.upsert({ where: { id }, update: data, create: { id, ...data } });
    leads.push(lead);
  }

  const [michael, jennifer, robert, amanda, david, lisa, kevin, sandra, carlos, patricia, thomas, nancy] = leads;

  // ── ACTIVITIES ────────────────────────────────────────────────────
  const activitiesData = [
    { leadId:michael.id, agentId:sarah.id, type:'call', description:'Outbound call — discussed budget and timeline. Pre-approval confirmed with lender.', outcome:'Connected', duration:840, createdAt: new Date(Date.now() - 1*24*60*60*1000) },
    { leadId:michael.id, agentId:sarah.id, type:'property_view', description:'Viewed 3 properties in Bethesda. Most interested in 4BR colonial on Elm St.', outcome:'Positive', createdAt: new Date(Date.now() - 3*24*60*60*1000) },
    { leadId:michael.id, agentId:sarah.id, type:'email', description:'Sent MLS alert for new listings matching criteria: 3-4BR, $600K-$700K, Bethesda/Chevy Chase.', outcome:'Opened', createdAt: new Date(Date.now() - 5*24*60*60*1000) },
    { leadId:michael.id, agentId:james.id, type:'sms', description:'Follow-up SMS: "Hi Michael, just wanted to check if you had a chance to review the listings I sent."', outcome:'Replied', createdAt: new Date(Date.now() - 2*24*60*60*1000) },
    { leadId:michael.id, agentId:sarah.id, type:'note', description:'Michael prefers move-in ready homes. Dealbreaker: no HOA over $300/mo. Wife works from home — needs office space.', createdAt: new Date(Date.now() - 6*24*60*60*1000) },

    { leadId:amanda.id, agentId:priya.id, type:'call', description:'First contact call. Luxury buyer relocating from NYC. Budget $800K-$950K. Needs 5BR.', outcome:'Connected', duration:1260, createdAt: new Date(Date.now() - 0.5*24*60*60*1000) },
    { leadId:amanda.id, agentId:priya.id, type:'email', description:'Sent welcome email with luxury listing portfolio and market report for NW DC / McLean.', outcome:'Opened', createdAt: new Date(Date.now() - 2*24*60*60*1000) },
    { leadId:amanda.id, agentId:james.id, type:'sms', description:'Appointment confirmation: Property tour Saturday 10am. 4 homes in McLean.', outcome:'Replied', createdAt: new Date(Date.now() - 1*24*60*60*1000) },

    { leadId:sandra.id, agentId:sarah.id, type:'status_change', description:'Status updated to Under Contract. Offer accepted at $718,000. Closing date: June 15.', createdAt: new Date(Date.now() - 1*24*60*60*1000) },
    { leadId:sandra.id, agentId:sarah.id, type:'docusign', description:'Purchase Agreement sent via DocuSign for e-signature.', outcome:'Signed', createdAt: new Date(Date.now() - 1*24*60*60*1000) },
    { leadId:sandra.id, agentId:sarah.id, type:'call', description:'Offer strategy call. Discussed escalation clause and inspection waiver options.', outcome:'Connected', duration:2100, createdAt: new Date(Date.now() - 4*24*60*60*1000) },

    { leadId:jennifer.id, agentId:marcus.id, type:'email', description:'Sent first-time buyer guide and pre-approval checklist.', outcome:'Opened', createdAt: new Date(Date.now() - 3*24*60*60*1000) },
    { leadId:jennifer.id, agentId:james.id, type:'call', description:'ISA outbound call. Jennifer interested but waiting to get pre-approved first.', outcome:'Connected', duration:480, createdAt: new Date(Date.now() - 5*24*60*60*1000) },
    { leadId:jennifer.id, agentId:marcus.id, type:'sms', description:'Lender referral sent via SMS. Recommended working with CrossCountry Mortgage.', outcome:'Replied', createdAt: new Date(Date.now() - 2*24*60*60*1000) },

    { leadId:nancy.id, agentId:sarah.id, type:'call', description:'Listing consultation call. Nancy wants to sell her current home before buying. Estimated sell price $590K.', outcome:'Connected', duration:1680, createdAt: new Date(Date.now() - 1*24*60*60*1000) },
    { leadId:nancy.id, agentId:sarah.id, type:'note', description:'Listing appointment scheduled for next Thursday. CMA in progress.', createdAt: new Date(Date.now() - 1*24*60*60*1000) },

    { leadId:patricia.id, agentId:priya.id, type:'property_view', description:'Virtual tour completed via Zoom. Patricia very interested in the Silver Spring condo listing.', outcome:'Positive', createdAt: new Date(Date.now() - 2*24*60*60*1000) },
    { leadId:patricia.id, agentId:james.id, type:'sms', description:'AI Nurture follow-up: "Hi Patricia! New homes just listed in your price range. Want me to set up alerts?"', outcome:'Replied', createdAt: new Date(Date.now() - 4*24*60*60*1000) },
  ];

  for (const act of activitiesData) {
    await prisma.activity.create({ data: act });
  }

  // ── DEALS (PIPELINE) ──────────────────────────────────────────────
  await prisma.deal.createMany({ data: [
    { leadId:michael.id, agentId:sarah.id, stage:'Active Search', propertyAddress:'412 Elm Street, Bethesda MD 20814', mlsId:'MDMC2001234', value:649000, commission:19470, closeDate: new Date('2026-07-15') },
    { leadId:amanda.id, agentId:priya.id, stage:'Qualifying', propertyAddress:null, value:875000, commission:26250, closeDate: new Date('2026-08-01') },
    { leadId:sandra.id, agentId:sarah.id, stage:'Under Contract', propertyAddress:'8821 Old Georgetown Rd, Bethesda MD 20814', mlsId:'MDMC2001891', value:718000, commission:21540, closeDate: new Date('2026-06-15') },
    { leadId:jennifer.id, agentId:marcus.id, stage:'Contacted', value:420000, commission:12600, closeDate: new Date('2026-09-01') },
    { leadId:nancy.id, agentId:sarah.id, stage:'Active Search', value:610000, commission:18300, closeDate: new Date('2026-07-30') },
    { leadId:patricia.id, agentId:priya.id, stage:'Qualifying', propertyAddress:'11200 Veirs Mill Rd #4A, Silver Spring MD 20902', mlsId:'MDMC2001756', value:495000, commission:14850, closeDate: new Date('2026-08-15') },
    { leadId:robert.id, agentId:diana.id, stage:'Contacted', value:525000, commission:15750, closeDate: new Date('2026-10-01') },
    { leadId:lisa.id, agentId:marcus.id, stage:'Qualifying', value:495000, commission:14850, closeDate: new Date('2026-09-15') },
  ]});

  // ── TASKS ─────────────────────────────────────────────────────────
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);

  await prisma.task.createMany({ data: [
    { leadId:michael.id, agentId:sarah.id, title:'Schedule property tour — 3 Bethesda listings', priority:'High', dueDate:tomorrow },
    { leadId:amanda.id, agentId:priya.id, title:'Prepare luxury market report for McLean/NW DC', priority:'High', dueDate:tomorrow },
    { leadId:sandra.id, agentId:sarah.id, title:'Follow up with title company on closing timeline', priority:'Urgent', dueDate:new Date() },
    { leadId:jennifer.id, agentId:marcus.id, title:'Check in on pre-approval status', priority:'Normal', dueDate:nextWeek },
    { leadId:nancy.id, agentId:sarah.id, title:'Complete CMA for listing appointment', priority:'High', dueDate:tomorrow },
    { leadId:david.id, agentId:james.id, title:'AI Nurture — first contact attempt', priority:'Low', dueDate:nextWeek },
    { leadId:carlos.id, agentId:james.id, title:'AI Nurture — first contact attempt', priority:'Low', dueDate:nextWeek },
    { leadId:thomas.id, agentId:james.id, title:'Send buyer guide and market overview', priority:'Normal', dueDate:nextWeek },
    { leadId:patricia.id, agentId:priya.id, title:'Send condo listings for Silver Spring + Rockville', priority:'Normal', dueDate:tomorrow },
    { leadId:kevin.id, agentId:diana.id, title:'Follow up — check on financing progress', priority:'Normal', dueDate:nextWeek },
  ]});

  // ── SAVED PROPERTIES + E-ALERTS ───────────────────────────────────
  await prisma.savedProperty.createMany({ data: [
    { leadId:michael.id, mlsId:'MDMC2001234', address:'412 Elm Street', city:'Bethesda', state:'MD', zip:'20814', price:649000, beds:4, baths:2.5, sqft:2840, status:'Active' },
    { leadId:michael.id, mlsId:'MDMC2001305', address:'7201 Brookville Rd', city:'Chevy Chase', state:'MD', zip:'20815', price:675000, beds:4, baths:3, sqft:3100, status:'Active' },
    { leadId:sandra.id, mlsId:'MDMC2001891', address:'8821 Old Georgetown Rd', city:'Bethesda', state:'MD', zip:'20814', price:718000, beds:4, baths:2.5, sqft:3200, status:'Pending' },
    { leadId:patricia.id, mlsId:'MDMC2001756', address:'11200 Veirs Mill Rd #4A', city:'Silver Spring', state:'MD', zip:'20902', price:495000, beds:3, baths:2, sqft:1480, status:'Active' },
  ]});

  await prisma.eAlert.createMany({ data: [
    { leadId:michael.id, name:'Bethesda 4BR Alert', city:'Bethesda', minPrice:580000, maxPrice:720000, minBeds:4, propertyType:'Single Family', frequency:'Daily', active:true },
    { leadId:jennifer.id, name:'First-Time Buyer Alert', city:'Silver Spring', minPrice:350000, maxPrice:450000, minBeds:2, propertyType:'Single Family', frequency:'Daily', active:true },
    { leadId:patricia.id, name:'Silver Spring Condo Alert', city:'Silver Spring', minPrice:440000, maxPrice:560000, minBeds:2, propertyType:'Condo', frequency:'Instant', active:true },
    { leadId:amanda.id, name:'McLean Luxury Alert', city:'McLean', minPrice:750000, maxPrice:950000, minBeds:5, propertyType:'Single Family', frequency:'Instant', active:true },
  ]});

  console.log('✅ Seeding complete!');
  console.log(`   ${agents.length} agents`);
  console.log(`   ${leads.length} leads`);
  console.log(`   ${activitiesData.length} activities`);
  console.log('   8 deals in pipeline');
  console.log('   10 tasks');
  console.log('   4 integrations configured');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
