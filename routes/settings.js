const express = require('express');
const { use } = require('passport');
const router = express.Router();
const settingsController = require('../controllers/settings controller');
const usersController = require('../controllers/users_controller');
const authMiddleware = require('../middleware/ensureAuthenticate');
const fs = require('fs');
const path = require('path');
const multer = require('multer');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
        console.log(file.fieldname);
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });




/* GET home page. */
router.get('/', authMiddleware.ensureAuthenticated, settingsController.get_settings);

router.get('/birds', authMiddleware.ensureAuthenticated, settingsController.get_birds);

router.get('/meds', authMiddleware.ensureAuthenticated, settingsController.get_meds);

router.get('/foods', authMiddleware.ensureAuthenticated, settingsController.get_foods);

// Create routers

router.get('/birds/create', authMiddleware.ensureAuthenticated, settingsController.get_create_bird);
router.post('/birds/create', authMiddleware.ensureAuthenticated, settingsController.post_create_bird);
router.get('/foods/create', authMiddleware.ensureAuthenticated, settingsController.get_create_food);
router.post('/foods/create', authMiddleware.ensureAuthenticated, settingsController.post_create_food);
router.get('/meds/create', authMiddleware.ensureAuthenticated, settingsController.get_create_medication);
router.post('/meds/create', authMiddleware.ensureAuthenticated, settingsController.post_create_med);

// Users routes
router.get('/users', authMiddleware.ensureAuthenticated, usersController.get_users);
router.get('/users/create', authMiddleware.ensureAuthenticated, usersController.get_create_user);
router.post('/users/create', authMiddleware.ensureAuthenticated, usersController.post_create_user);
router.get('/users/update', authMiddleware.ensureAuthenticated, usersController.get_update_user);
router.post('/users/update', authMiddleware.ensureAuthenticated, usersController.post_update_user);
router.get('/users/delete', authMiddleware.ensureAuthenticated, usersController.delete_user);
router.get('/users/updateimage', authMiddleware.ensureAuthenticated, usersController.get_update_user_image);
router.post('/users/addprofilepicture', authMiddleware.ensureAuthenticated, upload.single('image'), usersController.put_update_user_image);



// Update routers
router.get('/birds/update', authMiddleware.ensureAuthenticated, settingsController.get_birds_update);
router.get('/foods/update', authMiddleware.ensureAuthenticated, settingsController.get_foods_update);
router.get('/meds/update', authMiddleware.ensureAuthenticated, settingsController.get_meds_update);
router.post('/birds/update', authMiddleware.ensureAuthenticated, settingsController.post_birds_update);
router.post('/foods/update', authMiddleware.ensureAuthenticated, settingsController.post_foods_update);
router.post('/meds/update', authMiddleware.ensureAuthenticated, settingsController.post_meds_update);

// Delete routers
router.get('/birds/delete', authMiddleware.ensureAuthenticated, settingsController.delete_bird);
router.get('/foods/delete', authMiddleware.ensureAuthenticated, settingsController.delete_food);
router.get('/meds/delete', authMiddleware.ensureAuthenticated, settingsController.delete_med);

//Export routers
router.get('/birds/export', authMiddleware.ensureAuthenticated, settingsController.export_birds);
router.get('/foods/export', authMiddleware.ensureAuthenticated, settingsController.export_foods);
router.get('/meds/export', authMiddleware.ensureAuthenticated, settingsController.export_meds);
router.get('/users/export', authMiddleware.ensureAuthenticated, usersController.export_users);



 


module.exports = router;
