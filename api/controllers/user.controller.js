
import { errorHandler } from "../utils/error.js"
import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs';
import Listing from "../models/listing.model.js";


export const test = (req,res)=>{


    res.json({
        message: "test"
    })


}


export const updateUser = async (req,res,next)=>{

    //we need to check if ther a user is signing or not first by verfitoken fun
    if(req.user.id !== req.params.id)
    return next(errorHandler(401, 'you can only update your own account'));
   
    try {

        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        // create main fun to handle updating user

        const upadteUser = await User.findByIdAndUpdate(req.params.id,

            {
                // create an obj include set method to define which one form is update

                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            {new: true}
            
            
            )

            // after set which form is updatind we need to hash new password

            const {password, ...rest} = upadteUser._doc;

            res.status(200).json(rest)
        
    } catch (error) {

        next(error)
        
    }




}


export const deleteUser = async (req,res,next)=>{

// check if the current user is sign in or not to hava the abbility to delete the account or anything else


if(req.user.id !== req.params.id) return next(errorHandler(401, 'you can only delete your own account'))

try {
    await User.findByIdAndDelete(req.params.id)
    // status
    res.clearCookie('access_token');
    res.status(200).json("user has been deleted  ... !")
    
} catch (error) {
     next(error)
}


}


export const getUserListings = async (req,res,next) =>{
  
if (req.user.id === req.params.id) {
    try {
        const listings = await Listing.find({userRef: req.params.id})
        res.status(200).json(listings);
        
    } catch (error) {
        next(error)
        
    }
} else {
    return next(errorHandler(401, 'YOU CAN ONLY VIEW YOUR OWN LISTINGS ...!'))
}




}


export const getUser = async (req,res,next) =>{


    try {

        const user = await User.findById(req.params.id)
        if(!user) return next(errorHandler(404, "User Not Found"))

        const {password: pass , ...rest} = user._doc;

        res.status(200).json(rest)
        
    } catch (error) {

        next(error)
        
    }



}