

import { query } from "express"
import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"




export const createListing = async (req,res,next) =>{

try {
    const listing = await Listing.create(req.body)

    return res.status(201).json(listing)
    
} catch (error) {
    next(error)
}

}


export const deleteListing = async(req,res,next)=>{


    // first we gonna check if ther is listing or not 
    const listing = await Listing.findById(req.params.id)

    if(!listing){
        return next(errorHandler(404, "Listing Not Found"))
    }

    //second if statment we gonna check if the user is not logged

    if (req.user.id !== listing.userRef){
        return next(errorHandler(401, "YOU CAN ONLY DELETE YOUR OWN LISTING"))
    }

    // THEN WE GONNA TRY AND CATCH AS USUEL

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("listing has been deleted")
        
    } catch (error) {

        next(error)
        
    }







}




export const updateListing = async (req,res,next) =>{


    const listing = await Listing.findById(req.params.id);

    if(!listing) {
        return next(errorHandler(404, 'Listing is not found ...'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'YOU CAN ONLY UPDATE YOUR OWN LISTINGS ....'))
    }

    try {

        const updatedListing = await Listing.findByIdAndUpdate(


            req.params.id,
            req.body,
            {new: true}
        );

        res.status(200).json(updatedListing)
        
    } catch (error) {

        next(error)
        
    }



}


export const getListing = async(req,res,next) =>{


try {

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'LISTING IS NOT FOUND ...'))
    }
    

    res.status(200).json(listing);
} catch (error) {
    

    next(error)
}




}


export const getListings = async (req,res,next) =>{

    try {

        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        

        // start to handle all options in the app
        let offer = req.query.offer;
        
        if(offer === undefined || offer === false) {
            offer = {$in: [false , true]};
        }

        //what the means of that ? search query engine will search in both of ways if the offer is exist or not

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false'){
            furnished = { $in: [false, true] }
        }

        // third option will be parking 

        let parking = req.query.parking;

        if(parking === undefined || parking === 'false') {

            parking = {$in: [false , true]};
        };

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = {$in: ['sale' , 'rent']};
        }


        const searchTerm = req.query.searchTerm || '' ;

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc'


        const listings = await Listing.find({

            name: {$regex: searchTerm, $options: 'i'},
            offer,
            furnished,
            parking,
            type,




        })

        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);

        return res.status(200).json(listings)

        
    } catch (error) {
        next(error)
        
    }








}