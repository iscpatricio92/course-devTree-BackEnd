import { Request } from "express";
import slug from "slug";
import formidable from "formidable";
import cloudinary from "../config/cloudinary";
import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import { v4 as uuid } from 'uuid';

export const signUp = async (req: Request, res) => {
    const newUser = new User(req.body);
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        const error = new Error('User already exists with this email');
        return res.status(409).json({ message: error.message });
    }

    const handle = slug(req.body.handle, '');
    const handleExists = await User.findOne({ handle });
    if (handleExists) {
        const error = new Error('Handle already exists');
        return res.status(409).json({ message: error.message })
    }

    newUser.password = await hashPassword(password);
    newUser.handle = handle;
    await newUser.save();
    return res.status(201).json({ message: 'User created' });
}

export const signIn = async (req: Request, res) => {
    //check if user exists
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('User  does not exists with this email');
        return res.status(401).json({ error: error.message });
    }

    //check password
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
        const error = new Error('Invalid password');
        return res.status(401).json({ error: error.message });
    }

    //generate token
    const token = generateJWT({ id: user._id });
    return res.status(200).json({ access_token: token });
}

export const getProfile = async (req: Request, res) => {
    return res.status(200).json(req.user);
}

export const updateUser = async (req: Request, res) => {
    try {
        const { description, links } = req.body;

        const handle = slug(req.body.handle, '');
        const handleExists = await User.findOne({ handle });
        if (handleExists && handleExists.email !== req.user.email) {
            const error = new Error('Handle already exists');
            return res.status(409).json({ error: error.message })
        }

        //update user
        req.user.description = description;
        req.user.handle = handle;
        req.user.links = links;
        await req.user.save();
        return res.status(200).json({ message: 'User updated' });
    }
    catch (e) {
        const error = new Error('Error updating user');
        return res.status(500).json({ error: error.message });
    }
}

export const uploadImage = async (req: Request, res) => {
    try {
        const form = formidable({ multiples: false });
        form.parse(req, (error, fields, files) => {
            if (error) {
                throw new Error('Error parsing the form');
            }

            if (!files.file?.[0]?.filepath) {
                throw new Error('Must supply a file');
            }

            cloudinary.uploader.upload(files.file[0].filepath, {
                public_id: uuid(),
                folder: 'profile',
                resource_type: 'image',
            }, async (error, result) => {
                if (error) {
                    console.warn(error);
                    const err = new Error('Error uploading image');
                    return res.status(500).json({ error: err.message });
                }
                if (result) {
                    req.user.image = result.secure_url;
                    await req.user.save();
                    return res.json({ image: result.secure_url });
                }
            });
        });
    } catch (e) {
        const error = new Error('Error uploading image');
        console.warn(e);
        return res.status(500).json({ error: error.message });
    }
}
export const getUserByHandle = async (req: Request, res) => {
    try {
        const handle=req.params.handle;
        const userExist= await User.findOne({handle}).select('-password -_id -__v');
        if(!userExist){
            const error = new Error('User does not exist');
            return res.status(404).json({error:error.message})
        }
        return res.status(200).json(userExist)
    } catch (e) {
        const error = new Error('Error uploading image');
        console.warn(e);
        return res.status(500).json({ error: error.message });
    }
}

export const searchByHandle = async (req: Request, res) => {
    try {
        const handle=req.body.handle;
        const userExist= await User.findOne({handle}).select('-password -_id -__v');
        if(userExist){
            const error = new Error(`User ${handle} already exists`);
            return res.status(409).json({error:error.message})
        }
        return res.status(200).json({message:`User ${handle} is available`})
    } catch (e) {
        const error = new Error('Error uploading image');
        console.warn(e);
        return res.status(500).json({ error: error.message });
    }
}
