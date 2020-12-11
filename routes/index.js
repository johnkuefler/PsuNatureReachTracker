var express = require('express');
var router = express.Router();
let indexController = require('../controllers/index controller');
const authMiddleware = require('../middleware/ensureAuthenticate');

router.get('/', authMiddleware.ensureAuthenticated, indexController.get_index);
router.get('/reset', authMiddleware.ensureAuthenticated, indexController.get_reset);
router.post('/reset', authMiddleware.ensureAuthenticated, indexController.post_reset);

module.exports = router;
