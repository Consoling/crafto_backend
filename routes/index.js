const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('Crafto Mainline Server Running')
});

module.exports = router;
