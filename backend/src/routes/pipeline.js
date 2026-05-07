const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STAGES = ['New Lead','Contacted','Qualifying','Active Search','Offer Made','Under Contract','Closed Won','Closed Lost'];

// GET /api/pipeline — all deals grouped by stage
router.get('/', async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        lead: { select: { id:true, firstName:true, lastName:true, phone:true, email:true, temperature:true, score:true } },
        agent: { select: { id:true, name:true } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const grouped = {};
    STAGES.forEach(s => { grouped[s] = { stage: s, deals: [], totalValue: 0, totalCommission: 0 }; });
    deals.forEach(d => {
      if (grouped[d.stage]) {
        grouped[d.stage].deals.push(d);
        grouped[d.stage].totalValue      += d.value || 0;
        grouped[d.stage].totalCommission += d.commission || 0;
      }
    });

    res.json({ stages: STAGES, pipeline: grouped });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/pipeline/:id/stage — move deal to new stage
router.patch('/:id/stage', async (req, res) => {
  try {
    const { stage } = req.body;
    if (!STAGES.includes(stage)) return res.status(400).json({ error: 'Invalid stage' });
    const deal = await prisma.deal.update({ where: { id: req.params.id }, data: { stage } });

    // Sync lead status
    const statusMap = {
      'New Lead': 'New', 'Contacted': 'Contacted', 'Qualifying': 'Nurturing',
      'Active Search': 'Nurturing', 'Offer Made': 'Hot',
      'Under Contract': 'Under Contract', 'Closed Won': 'Closed', 'Closed Lost': 'Lost'
    };
    if (statusMap[stage]) {
      await prisma.lead.update({ where: { id: deal.leadId }, data: { status: statusMap[stage] } });
    }
    res.json(deal);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// POST /api/pipeline — create deal
router.post('/', async (req, res) => {
  try {
    const deal = await prisma.deal.create({ data: req.body });
    res.status(201).json(deal);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// PATCH /api/pipeline/:id — update deal
router.patch('/:id', async (req, res) => {
  try {
    const deal = await prisma.deal.update({ where: { id: req.params.id }, data: req.body });
    res.json(deal);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
