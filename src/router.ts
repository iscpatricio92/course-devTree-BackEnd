import {Router} from 'express';
import User from './models/User';
const router = Router();

/** Autentication and register  */
router.post('/auth/signup', async (req, res) => {
    console.log(`Signup ${JSON.stringify(req.body)}`);
    await User.create(req.body);
    res.json({message: 'User created'});
});

export default router;