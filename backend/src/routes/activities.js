const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { leadId, agentId, type, limit = 20 } = req.query;
    const where = {};
    if (leadId)  where.leadId  = leadId;
    if (agentId) where.agentId = agentId;
    if (type)    where.type    = type;
    const activities = await prisma.activity.findMany({
      where, take: parseInt(limit), orderBy: { createdAt: 'desc' },
      include: {
        lead:  { select: { id:true, firstName:true, lastName:true } },
        agent: { select: { id:true, name:true } }
      }
    });
    res.json(activities);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const activity = await prisma.activity.create({ data: req.body });
    await prisma.lead.update({ where: { id: req.body.leadId }, data: { lastContact: new Date() } });
    res.status(201).json(activity);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
