import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { Request, NextFunction } from 'express';

declare global{
    namespace Express{
        interface Request{
            user: IUser
        }
    }
}
export const authenticate = async (req: Request, res, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error('Bearer not found');
        return res.status(401).json({ message: error.message });
    }

    const [, token]= bearer.split(' ');
    if(!token){
        const error = new Error('Token not found');
        return res.status(401).json({ message: error.message });
    }

    try{
        const result= jwt.verify(token, process.env.JWT_SECRET);
        if(typeof result === 'object' && result.id){
            const user = await User.findById(result.id).select('-password');
            if (!user) {
                const error = new Error('User not found');
                return res.status(404).json({ message: error.message });
            }
            req.user = user;
            next()
        }
    }
    catch(error){
        console.log(error);
        return res.status(403).json({ message: error.message });
    }
}