const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { agentId, leadId, completed } = req.query;
    const where = {};
    if (agentId)   where.agentId   = agentId;
    if (leadId)    where.leadId    = leadId;
    if (completed !== undefined) where.completed = completed === 'true';
    const tasks = await prisma.task.findMany({
      where, orderBy: { dueDate: 'asc' },
      include: {
        lead:  { select: { id:true, firstName:true, lastName:true } },
        agent: { select: { id:true, name:true } }
      }
    });
    res.json(tasks);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const task = await prisma.task.create({ data: req.body });
    res.status(201).json(task);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.completed === true) data.completedAt = new Date();
    const task = await prisma.task.update({ where: { id: req.params.id }, data });
    res.json(task);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
