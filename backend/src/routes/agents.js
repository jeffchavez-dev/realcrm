const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      include: { _count: { select: { leads:true, deals:true, activities:true, tasks:true } } },
      orderBy: { name: 'asc' }
    });
    res.json(agents);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: req.params.id },
      include: {
        leads: { orderBy: { updatedAt: 'desc' }, take: 20 },
        deals: { orderBy: { updatedAt: 'desc' } },
        tasks: { where: { completed: false }, orderBy: { dueDate: 'asc' } },
        _count: { select: { leads:true, deals:true, activities:true } }
      }
    });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    res.json(agent);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const agent = await prisma.agent.create({ data: req.body });
    res.status(201).json(agent);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const agent = await prisma.agent.update({ where: { id: req.params.id }, data: req.body });
    res.json(agent);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
