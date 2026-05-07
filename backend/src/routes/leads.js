const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/leads — list with filters
router.get('/', async (req, res) => {
  try {
    const { status, source, agentId, temperature, search, page = 1, limit = 25 } = req.query;
    const where = {};
    if (status)      where.status = status;
    if (source)      where.source = source;
    if (agentId)     where.agentId = agentId;
    if (temperature) where.temperature = temperature;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName:  { contains: search, mode: 'insensitive' } },
        { email:     { contains: search, mode: 'insensitive' } },
        { phone:     { contains: search } },
      ];
    }
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where, skip: (page - 1) * limit, take: parseInt(limit),
        include: { assignedTo: { select: { id:true, name:true, email:true } } },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.lead.count({ where })
    ]);
    res.json({ leads, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/leads/:id — full lead profile
router.get('/:id', async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: {
        assignedTo: true,
        activities: { orderBy: { createdAt: 'desc' }, take: 50 },
        deals: { include: { agent: { select: { name:true } } } },
        tasks: { orderBy: { dueDate: 'asc' }, include: { agent: { select: { name:true } } } },
        properties: { orderBy: { savedAt: 'desc' } },
        alerts: true,
      }
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/leads — create
router.post('/', async (req, res) => {
  try {
    const lead = await prisma.lead.create({ data: req.body });
    res.status(201).json(lead);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// PATCH /api/leads/:id — update
router.patch('/:id', async (req, res) => {
  try {
    const lead = await prisma.lead.update({ where: { id: req.params.id }, data: req.body });
    res.json(lead);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// DELETE /api/leads/:id — delete
router.delete('/:id', async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// POST /api/leads/:id/activities — log activity
router.post('/:id/activities', async (req, res) => {
  try {
    const activity = await prisma.activity.create({
      data: { ...req.body, leadId: req.params.id, createdAt: new Date() }
    });
    // Update lastContact
    await prisma.lead.update({ where: { id: req.params.id }, data: { lastContact: new Date() } });
    res.status(201).json(activity);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// GET /api/leads/stats/summary — source/status breakdown
router.get('/stats/summary', async (req, res) => {
  try {
    const [bySource, byStatus, byTemp] = await Promise.all([
      prisma.lead.groupBy({ by: ['source'], _count: true }),
      prisma.lead.groupBy({ by: ['status'], _count: true }),
      prisma.lead.groupBy({ by: ['temperature'], _count: true }),
    ]);
    res.json({ bySource, byStatus, byTemp });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
