import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import Client from '../models/client.model.js';
import Subscription from '../models/subscription.model.js';

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) 
      ? date.toISOString().split('T')[0]
      : "";
  };
// const protect = asyncHandler(async (req,res,next)=>{
//     let token;
//     token = req.cookies.jwt;

//     if (token) {
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             console.log('Decoded Token:', decoded); // Debugging line

//             req.user = await Client.findById(decoded.clientId).select('-phoneNumber');
//             console.log('Found User:', req.user); // Debugging line

//             next();

//         } catch (error) {
//             res.status(401);
//             throw new Error("Not authorized, invalid token");
//         }

//     } else {
//         res.status(401);
//         throw new Error("Not authorized, no token");
//     }






// })
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            req.user = await Client.findById(decoded.ClientInfo.id).select('-phoneNumber');
            // console.log(decoded)
            // console.log(`CURRENT USER ${req.user}`)
            next()
        }
    )
}


const isAdmin = asyncHandler((req,res,next)=>{
    if(!req.user.isAdmin){
        return res.status(403).json({ message: 'Access denied: Admin only' });
    }
    next();
})

const isSubscribed = asyncHandler(async (req,res,next) => {
    if(!req.user.isAdmin){
        console.log(req.user)
    
    
    const currSubscription = await Subscription.findOne({userId: req.user._id})
    if(!currSubscription){
        return res.status(403).json({ message: 'Access denied: subscription not yet set' });
    }else{
        const endDateString =formatDate(currSubscription.endDate) 
        const nowString = formatDate(new Date());
        console.log(currSubscription)

        const endDate = new Date(endDateString)
        const now = new Date(nowString)
       

        if(endDate < now){
            return res.status(403).json({ message: 'Access denied: subscription expired' });
        }

    }
}

    next();



}

)
export { protect , isSubscribed , isAdmin}