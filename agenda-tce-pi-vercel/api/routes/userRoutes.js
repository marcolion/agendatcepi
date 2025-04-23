const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/login', userController.getLoginPage);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// Rotas protegidas - apenas administradores
router.get('/users', isAuthenticated, isAdmin, userController.getUsersPage);
router.get('/users/add', isAuthenticated, isAdmin, userController.getAddUserPage);
router.post('/users/add', isAuthenticated, isAdmin, userController.addUser);
router.get('/users/edit/:id', isAuthenticated, isAdmin, userController.getEditUserPage);
router.post('/users/edit/:id', isAuthenticated, isAdmin, userController.updateUser);
router.delete('/users/:id', isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;
