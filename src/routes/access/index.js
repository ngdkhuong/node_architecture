'use strict';

const express = require('express');
const AccessController = require('../../controllers/access.controller.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authentication } = require('../../auth/authUtils.js');
const router = express.Router();

router.post('/users/signup', asyncHandler(AccessController.signUp));
router.post('/users/login', asyncHandler(AccessController.login));
router.use(authentication);
router.post('/users/logout', asyncHandler(AccessController.logout));
router.post('/users/handlerRefreshToken', asyncHandler(AccessController.handlerRefreshToken));

module.exports = router;
