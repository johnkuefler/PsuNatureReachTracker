const express = require('express');
const { use } = require('passport');
const router = express.Router();
const settingsController = require('../controllers/settings controller');
const usersController = require('../controllers/users_controller');
const instructionsController = require('../controllers/instructionsController');
const authMiddleware = require('../middleware/ensureAuthenticate');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

/* Image Upload */
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

router.get('/instructions', authMiddleware.ensureAuthenticated, instructionsController.get_instructions);


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
router.get('/birds/export', authMiddleware.ensureAuthenticated, settingsController.get_all_export_birds);
router.get('/foods/export', authMiddleware.ensureAuthenticated, settingsController.get_all_export_foods);
router.get('/meds/export', authMiddleware.ensureAuthenticated, settingsController.get_all_export_meds);
router.get('/users/export', authMiddleware.ensureAuthenticated, usersController.get_all_export_users);


//User Image Router
router.get('/users/updateimage', authMiddleware.ensureAuthenticated, usersController.get_update_user_image);
router.post('/users/addprofilepicture', authMiddleware.ensureAuthenticated, upload.single('image'), usersController.put_update_user_image);

//Food Image Router
router.get('/foods/updatefoodimage', authMiddleware.ensureAuthenticated, settingsController.get_update_food_image);
router.post('/foods/addfoodpicture', authMiddleware.ensureAuthenticated, upload.single('image'), settingsController.put_update_food_image);

//Medication Image Router
router.get('/meds/updatemedicationimage', authMiddleware.ensureAuthenticated, settingsController.get_update_med_image);
router.post('/meds/addmedicationpicture', authMiddleware.ensureAuthenticated, upload.single('image'), settingsController.put_update_med_image);

//Animal Image Router
router.get('/birds/updateanimalimage', authMiddleware.ensureAuthenticated, settingsController.get_update_bird_image);
router.post('/birds/addanimalpicture', authMiddleware.ensureAuthenticated, upload.single('image'), settingsController.put_update_bird_image);



module.exports = router;
