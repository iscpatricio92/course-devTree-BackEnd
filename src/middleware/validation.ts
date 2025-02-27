import { validationResult } from "express-validator";

export const handleInputErrors = (req:Request, res, next) => {
    //manage errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    return next();
}