const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/dashboard — all metrics
router.get('/', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo  = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const today         = new Date(); today.setHours(23, 59, 59, 999);
    const todayStart    = new Date(); todayStart.setHours(0, 0, 0, 0);

    const [
      totalLeads, newLeadsThisMonth, hotLeads,
      activePipeline, underContract, totalDeals,
      tasksDueToday, overdueTasksCount,
      recentActivities, agentLeadCounts,
      leadsBySource, leadsByStatus,
      topAgents
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.lead.count({ where: { temperature: 'Hot' } }),
      prisma.deal.count({ where: { stage: { notIn: ['Closed Won', 'Closed Lost'] } } }),
      prisma.deal.count({ where: { stage: 'Under Contract' } }),
      prisma.deal.aggregate({ _sum: { commission: true }, where: { stage: { notIn: ['Closed Won', 'Closed Lost'] } } }),
      prisma.task.count({ where: { completed: false, dueDate: { gte: todayStart, lte: today } } }),
      prisma.task.count({ where: { completed: false, dueDate: { lt: todayStart } } }),
      prisma.activity.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { lead: { select: { id:true, firstName:true, lastName:true } }, agent: { select: { name:true } } } }),
      prisma.lead.groupBy({ by: ['agentId'], _count: true }),
      prisma.lead.groupBy({ by: ['source'], _count: { _all: true }, orderBy: { _count: { source: 'desc' } } }),
      prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.agent.findMany({ include: { _count: { select: { leads: true, deals: true, activities: true } } }, take: 5 }),
    ]);

    // Pipeline value
    const pipelineValue = totalDeals._sum.commission || 0;

    res.json({
      stats: {
        totalLeads,
        newLeadsThisMonth,
        hotLeads,
        activePipeline,
        underContract,
        pipelineValue,
        tasksDueToday,
        overdueTasksCount,
      },
      charts: {
        leadsBySource: leadsBySource.map(s => ({ source: s.source, count: s._count._all || s._count || 0 })),
        leadsByStatus: leadsByStatus.map(s => ({ status: s.status, count: s._count._all || s._count || 0 })),
      },
      recentActivities,
      topAgents,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
