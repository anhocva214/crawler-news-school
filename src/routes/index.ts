import { Router } from 'express';
import { Middleware } from '@shared/auth';

// Account
import {
    AddOneAccount,
    GetListAccount,
    Login,
    Logout,
    CheckTokenUser,
    VerifyEmail,
    UpdateChannelAccount,
    GetAllChanel,
    UpdateNewPassword
} from './account';



// Account-route
const accountRouter = Router();
accountRouter.post('/register', AddOneAccount)
accountRouter.get('/list', GetListAccount)
accountRouter.post('/login', Login)
accountRouter.get('/logout', Middleware, Logout)
accountRouter.get('/check-token', Middleware, CheckTokenUser)
accountRouter.post('/verify-email', VerifyEmail)
accountRouter.post('/update-channel', Middleware, UpdateChannelAccount)
accountRouter.get('/all-channel', GetAllChanel)
accountRouter.put('/update-password', UpdateNewPassword)




// Export the base-router
const baseRouter = Router();
baseRouter.use('/account', accountRouter);




export default baseRouter;
