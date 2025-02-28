import jwt, { JwtPayload } from 'jsonwebtoken';
export const generateJWT= (payload:JwtPayload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
}