const express = require('express');
const router = express.Router();

const DEMO_TOKEN = 'demo-jwt';

router.post('/login', (req, res) => {
  res.status(200).json({ token: DEMO_TOKEN });
});

module.exports = router;