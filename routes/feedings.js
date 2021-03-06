var express = require('express');
var router = express.Router();
const feedingsController = require('../controllers/feedings controller');
const authMiddleware = require('../middleware/ensureAuthenticate');

/* GET home page. */
router.get('/', authMiddleware.ensureAuthenticated, feedingsController.get_feedings);
router.get('/create', authMiddleware.ensureAuthenticated, feedingsController.get_feedings_create);
router.post('/create', authMiddleware.ensureAuthenticated, feedingsController.post_feedings_create);
router.get('/update', authMiddleware.ensureAuthenticated, feedingsController.get_feedings_update);
router.post('/update', authMiddleware.ensureAuthenticated, feedingsController.post_feedings_update);
router.get('/delete', authMiddleware.ensureAuthenticated, feedingsController.delete_feedings);
router.get('/allexport', authMiddleware.ensureAuthenticated, feedingsController.get_all_export_feedings);
router.get('/specificexport', authMiddleware.ensureAuthenticated, feedingsController.get_specific_export_feedings);
router.get('/export', authMiddleware.ensureAuthenticated, feedingsController.get_export_feedings_page);

module.exports = router;