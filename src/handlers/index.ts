import { Request } from "express";
import slug from "slug";
import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import jwt from 'jsonwebtoken';

export const createAccount = async (req:Request, res)=>{
    const newUser = new User(req.body);
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        const error= new Error('User already exists with this email');
        return res.status(409).json({message:error.message});
    }

    const handle = slug(req.body.handle,'');
    const handleExists = await User.findOne({handle});
    if(handleExists){
        const error= new Error('Handle already exists');
        return res.status(409).json({message:error.message})
    }

    newUser.password = await hashPassword(password);
    newUser.handle = handle;
    await newUser.save();
    return res.status(201).json({message: 'User created'});
}

export const signIn= async (req:Request, res)=>{
    //check if user exists
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        const error= new Error('User  does not exists with this email');
        return res.status(401).json({error:error.message});
    }

    //check password
    const validPassword = await comparePassword(password, user.password);
    if(!validPassword){
        const error= new Error('Invalid password');
        return res.status(401).json({error:error.message});
    }

    //generate token
    const token = generateJWT({id:user._id});
    return res.status(200).json({access_token: token});
}

export const getProfile = async (req: Request, res) => {
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
            return res.status(200).json(user);
        }
    }
    catch(error){
        console.log(error);
        
        return res.status(403).json({ message: error.message });
    }
}

