const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: 'public' });
});

module.exports = router;
