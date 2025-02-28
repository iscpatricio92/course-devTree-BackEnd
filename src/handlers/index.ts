import { Request } from "express";
import slug from "slug";
import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

export const signUp = async (req:Request, res)=>{
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
    return res.status(200).json(req.user);
}

export const updateUser = async (req: Request, res) => {
    try{
        const { description } = req.body;

        const handle = slug(req.body.handle,'');
        const handleExists = await User.findOne({handle});
        if(handleExists && handleExists.email !== req.user.email){
            const error= new Error('Handle already exists');
            return res.status(409).json({message:error.message})
        }

        //update user
        req.user.description = description;
        req.user.handle = handle;
        await req.user.save();
        return res.status(200).json({message: 'User updated'});
    }
    catch(e){
        const error = new Error('Error updating user');
        return res.status(500).json({error: error.message});
    }
}

