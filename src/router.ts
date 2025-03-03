import {Router} from 'express';
import {body} from 'express-validator'
import { signUp, signIn, getProfile, updateUser, uploadImage } from './handlers';
import { handleInputErrors } from './middleware/validation';
import { authenticate } from './middleware/auth';
const router = Router();

/** Autentication and register  */
router.post('/auth/sign-up',
    body('handle').notEmpty().withMessage('Handle is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters'),
    handleInputErrors,
    signUp);

router.post('/auth/sign-in',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleInputErrors,
    signIn)

router.get('/profile',authenticate,getProfile)

router.patch('/profile',
    body('handle').notEmpty().withMessage('Handle is required'),
    body('description').optional(),
    authenticate,
    updateUser)

router.post('/user/image',authenticate, uploadImage)

export default router;