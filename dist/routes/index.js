"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("@shared/auth");
// Account
const account_1 = require("./account");
// Account-route
const accountRouter = express_1.Router();
accountRouter.post('/register', account_1.AddOneAccount);
accountRouter.get('/list', account_1.GetListAccount);
accountRouter.post('/login', account_1.Login);
accountRouter.get('/logout', auth_1.Middleware, account_1.Logout);
accountRouter.get('/check-token', auth_1.Middleware, account_1.CheckTokenUser);
accountRouter.post('/verify-email', account_1.VerifyEmail);
accountRouter.post('/update-channel', auth_1.Middleware, account_1.UpdateChannelAccount);
accountRouter.get('/all-channel', account_1.GetAllChanel);
accountRouter.put('/update-password', account_1.UpdateNewPassword);
// Export the base-router
const baseRouter = express_1.Router();
baseRouter.use('/account', accountRouter);
exports.default = baseRouter;
