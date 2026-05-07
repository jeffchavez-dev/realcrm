const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'realcrm-demo-secret-2026';
const JWT_EXPIRES = '24h';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.active)
      return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: 'Invalid email or password' });

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, agentId: user.agentId },
      JWT_SECRET, { expiresIn: JWT_EXPIRES }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, agentId: user.agentId }
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id:true, name:true, email:true, role:true, agentId:true, lastLogin:true }
    });
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/logout (client just drops the token, but log it)
router.post('/logout', require('../middleware/auth'), (req, res) => {
  res.json({ success: true });
});

module.exports = router;
