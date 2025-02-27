import {Router} from 'express';
const router = Router();

/** Autentication and register  */
router.post('/auth/signup', (req, res) => {
    console.log(`Signup ${JSON.stringify(req.body)}`);
    res.send('Signup');
    
});

export default router;