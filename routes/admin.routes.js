const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.render('admin');
});

router.post('/admin/addProduct', isAuthenticated, isAdmin, adminController.addProduct);

router.post('/admin/removeProduct/:id', isAuthenticated, isAdmin, adminController.removeProduct);

module.exports = router;