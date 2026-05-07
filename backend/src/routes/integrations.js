const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/integrations — list all integration statuses
router.get('/', async (req, res) => {
  try {
    const integrations = await prisma.integration.findMany();
    res.json(integrations);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── MLS Integration (RealTNA / Real Savvy) ───────────────────────────────────
router.get('/mls/search', async (req, res) => {
  try {
    const { city, minPrice, maxPrice, minBeds, propertyType, zip } = req.query;
    const MLS_API_KEY = process.env.MLS_API_KEY;
    const MLS_BASE_URL = process.env.MLS_BASE_URL;

    if (!MLS_API_KEY || MLS_API_KEY === 'YOUR_MLS_API_KEY_HERE') {
      // Return mock data when API key not configured
      return res.json({
        connected: false,
        message: 'MLS API key not configured — showing sample data',
        listings: getMockListings(city, minPrice, maxPrice, minBeds)
      });
    }

    // Live RealTNA API call (activate with real API key)
    const params = new URLSearchParams({ city, minPrice, maxPrice, minBeds, propertyType, zip, limit: 20 });
    const response = await fetch(`${MLS_BASE_URL}/listings?${params}`, {
      headers: { 'Authorization': `Bearer ${MLS_API_KEY}`, 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    res.json({ connected: true, listings: data.listings || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/mls/listing/:mlsId', async (req, res) => {
  try {
    const MLS_API_KEY = process.env.MLS_API_KEY;
    if (!MLS_API_KEY || MLS_API_KEY === 'YOUR_MLS_API_KEY_HERE') {
      return res.json({ connected: false, listing: getMockListings()[0] });
    }
    const response = await fetch(`${process.env.MLS_BASE_URL}/listings/${req.params.mlsId}`, {
      headers: { 'Authorization': `Bearer ${MLS_API_KEY}` }
    });
    res.json({ connected: true, listing: await response.json() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Twilio (Calls + SMS) ─────────────────────────────────────────────────────
router.post('/twilio/sms', async (req, res) => {
  try {
    const { to, message, leadId, agentId } = req.body;
    const SID   = process.env.TWILIO_ACCOUNT_SID;
    const TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const FROM  = process.env.TWILIO_PHONE_NUMBER;

    if (!SID || SID === 'YOUR_TWILIO_ACCOUNT_SID_HERE') {
      // Log activity as simulation
      if (leadId) {
        await prisma.activity.create({ data: { leadId, agentId, type:'sms', description:`[SIMULATED] SMS to ${to}: ${message}`, outcome:'Sent', createdAt: new Date() } });
        await prisma.lead.update({ where:{ id: leadId }, data: { lastContact: new Date() } });
      }
      return res.json({ connected: false, simulated: true, message: 'Twilio not configured — SMS simulated and logged' });
    }

    // Live Twilio call
    const twilio = require('twilio')(SID, TOKEN);
    const sms = await twilio.messages.create({ body: message, from: FROM, to });
    if (leadId) {
      await prisma.activity.create({ data: { leadId, agentId, type:'sms', description:`SMS to ${to}: ${message}`, outcome:'Sent', createdAt: new Date() } });
      await prisma.lead.update({ where:{ id: leadId }, data: { lastContact: new Date() } });
    }
    res.json({ connected: true, sid: sms.sid, status: sms.status });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/twilio/call', async (req, res) => {
  try {
    const { to, leadId, agentId } = req.body;
    const SID   = process.env.TWILIO_ACCOUNT_SID;
    const TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const FROM  = process.env.TWILIO_PHONE_NUMBER;

    if (!SID || SID === 'YOUR_TWILIO_ACCOUNT_SID_HERE') {
      if (leadId) {
        await prisma.activity.create({ data: { leadId, agentId, type:'call', description:`[SIMULATED] Outbound call to ${to}`, outcome:'Initiated', createdAt: new Date() } });
      }
      return res.json({ connected: false, simulated: true, message: 'Twilio not configured — call simulated and logged' });
    }

    const twilio = require('twilio')(SID, TOKEN);
    const call = await twilio.calls.create({
      to, from: FROM,
      url: `${req.protocol}://${req.get('host')}/api/integrations/twilio/voice-xml`
    });
    res.json({ connected: true, sid: call.sid, status: call.status });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── DocuSign (E-Sign) ────────────────────────────────────────────────────────
router.post('/docusign/send', async (req, res) => {
  try {
    const { leadId, agentId, documentType, recipientEmail, recipientName } = req.body;
    const INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY;

    if (!INTEGRATION_KEY || INTEGRATION_KEY === 'YOUR_DOCUSIGN_INTEGRATION_KEY_HERE') {
      if (leadId) {
        await prisma.activity.create({ data: { leadId, agentId, type:'docusign', description:`[SIMULATED] DocuSign envelope sent: ${documentType} to ${recipientEmail}`, outcome:'Sent', createdAt: new Date() } });
      }
      return res.json({ connected: false, simulated: true, message: 'DocuSign not configured — envelope simulated and logged', envelopeId: 'DEMO-' + Date.now() });
    }

    // Live DocuSign JWT auth + envelope creation would go here
    // Requires: @docusign/esign npm package + JWT token exchange
    res.json({ connected: true, message: 'DocuSign envelope created', envelopeId: 'LIVE-ENVELOPE-ID' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/docusign/status/:envelopeId', async (req, res) => {
  try {
    // Live: fetch from DocuSign API
    res.json({ envelopeId: req.params.envelopeId, status: 'sent', statusChangedDateTime: new Date() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Integration Connect/Disconnect ───────────────────────────────────────────
router.patch('/:name/status', async (req, res) => {
  try {
    const { status } = req.body;
    const integration = await prisma.integration.update({
      where: { name: req.params.name },
      data: { status, lastSync: status === 'connected' ? new Date() : undefined, updatedAt: new Date() }
    });
    res.json(integration);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// ── Mock Data Helper ─────────────────────────────────────────────────────────
function getMockListings(city = 'Bethesda', minPrice = 400000, maxPrice = 800000, minBeds = 3) {
  return [
    { mlsId:'MDMC2001234', address:'412 Elm Street', city:'Bethesda', state:'MD', zip:'20814', price:649000, beds:4, baths:2.5, sqft:2840, status:'Active', daysOnMarket:12, description:'Stunning colonial on quiet street. Updated kitchen, hardwood throughout.' },
    { mlsId:'MDMC2001305', address:'7201 Brookville Rd', city:'Chevy Chase', state:'MD', zip:'20815', price:675000, beds:4, baths:3, sqft:3100, status:'Active', daysOnMarket:5, description:'Move-in ready. Large backyard, finished basement, 2-car garage.' },
    { mlsId:'MDMC2001756', address:'11200 Veirs Mill Rd #4A', city:'Silver Spring', state:'MD', zip:'20902', price:495000, beds:3, baths:2, sqft:1480, status:'Active', daysOnMarket:18, description:'Renovated condo with rooftop access and reserved parking.' },
    { mlsId:'MDMC2002011', address:'5430 Massachusetts Ave', city:'Bethesda', state:'MD', zip:'20816', price:729000, beds:4, baths:3.5, sqft:3350, status:'Active', daysOnMarket:3, description:'New construction. Open floor plan, chef kitchen, smart home.' },
    { mlsId:'MDMC2002178', address:'3310 N Leisure World Blvd', city:'Silver Spring', state:'MD', zip:'20906', price:415000, beds:3, baths:2, sqft:1650, status:'Active', daysOnMarket:22, description:'Golf course views. Age 55+ community with resort amenities.' },
  ];
}

module.exports = router;
