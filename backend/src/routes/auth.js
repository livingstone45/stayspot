const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/auth.controller');
const invitationController = require('../controllers/auth/invitation.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validateLogin, validateRegister, validateInvitation } = require('../middleware/validation');

// Public routes
router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.get('/verify-email/:token', authController.verifyEmail);

// Protected routes
router.use(authenticate);

// Invitation routes
router.post('/invite', authorize(['system_admin', 'company_admin', 'portfolio_manager']), validateInvitation, invitationController.createInvitation);
router.get('/invitations', authorize(['system_admin', 'company_admin', 'portfolio_manager']), invitationController.getInvitations);
router.get('/invitations/:id', authorize(['system_admin', 'company_admin', 'portfolio_manager']), invitationController.getInvitationById);
router.put('/invitations/:id/resend', authorize(['system_admin', 'company_admin', 'portfolio_manager']), invitationController.resendInvitation);
router.delete('/invitations/:id', authorize(['system_admin', 'company_admin']), invitationController.deleteInvitation);
router.post('/invitations/accept/:token', invitationController.acceptInvitation);

// User management routes
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.put('/change-password', authController.changePassword);
router.get('/logout', authController.logout);

// Role-based access testing
router.get('/test/system-admin', authorize(['system_admin']), (req, res) => {
    res.json({ message: 'System admin access granted' });
});

router.get('/test/company-admin', authorize(['company_admin']), (req, res) => {
    res.json({ message: 'Company admin access granted' });
});

router.get('/test/property-manager', authorize(['property_manager']), (req, res) => {
    res.json({ message: 'Property manager access granted' });
});

module.exports = router;