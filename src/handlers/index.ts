import { Request, Response } from "express";
import slug from "slug";
import { validationResult } from "express-validator";
import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";

export const createAccount = async (req:Request, res)=>{
    //manage errors
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const newUser = new User(req.body);
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        const error= new Error('User already exists with this email');
        return res.status(409).json(error.message);
    }

    const handle = slug(req.body.handle,'');
    const handleExists = await User.findOne({handle});
    if(handleExists){
        const error= new Error('Handle already exists');
        return res.status(409).json(error.message)
    }

    newUser.password = await hashPassword(password);
    newUser.handle = handle;
    await newUser.save();
    return res.status(201).json({message: 'User created'});
}

export const sigIn= async (req:Request, res)=>{
    //manage errors
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //check if user exists
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        const error= new Error('User  does not exists with this email');
        return res.status(401).json(error.message);
    }

    //check password
    const validPassword = await comparePassword(password, user.password);
    if(!validPassword){
        const error= new Error('Invalid password');
        return res.status(401).json(error.message);
    }
}