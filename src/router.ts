import {Router} from 'express';
import {body} from 'express-validator'
import { createAccount, signIn, getProfile } from './handlers';
import { handleInputErrors } from './middleware/validation';
import { autheticate } from './middleware/auth';
const router = Router();

/** Autentication and register  */
router.post('/auth/sign-up',
    body('handle').notEmpty().withMessage('Handle is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters'),
    handleInputErrors,
    createAccount);

router.post('/auth/sign-in',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleInputErrors,
    signIn)

router.get('/profile',
    autheticate,
    getProfile
)

export default router;