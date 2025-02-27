import {Router} from 'express';
import User from './models/User';
const router = Router();

/** Autentication and register  */
router.post('/auth/signup', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({message: 'User created'});
});

export default router;