import Client from '../models/client.model.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken'
import DietPlan from '../models/dietplan.model.js';
import WorkoutPlan from '../models/workoutplan.model.js';
import Subscription from '../models/subscription.model.js';

// @desc Login
// @route POST /auth
// @access Public


const authClient = asyncHandler(async (req,res)=>{
    const {fullName , phoneNumber} = req.body;
    if (!fullName || !phoneNumber) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const client = await Client.findOne({fullName});
    if (client && (await client.matchPhoneNumber(phoneNumber))){
        const token = generateToken(res, client);
        
    } else {
        res.status(401);
        throw new Error('invalid phone number or name')
    }

}
)

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired

const ClientTokenRefresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt
    

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
                console.log(decoded.fullName)

            const foundClient = await Client.findOne({ fullName: decoded.fullName }).exec()

            if (!foundClient) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                    {
                        "ClientInfo": {
                            "id": foundClient._id,
                            "fullName": foundClient.fullName, 
                            "phoneNumber": foundClient.phoneNumber,
                            "isAdmin": foundClient.isAdmin
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
            )
            const clientId = foundClient._id


            res.json({ accessToken ,clientId  })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists


const logoutClient = asyncHandler(async (req,res)=>{
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
})



const fetchClients = asyncHandler(async (req,res) => {
        const clients = await Client.find({});
        res.status(200).json(clients);
});

const fetchClient = asyncHandler(async (req,res) => {
    const {id} = req.params
    // const ObjectCID = new ObjectId(id)
    // console.log(id)

    const client = await Client.findById(id);
    if (client) {
        res.json({
          client
        });
      } else {
        res.status(404);
        throw new Error('User not found');
      }})

const addClient = asyncHandler( async (req,res) => {
        const {phoneNumber , fullName} = req.body;
        const ClientExists = await Client.findOne({fullName});
        if (ClientExists){
            res.status(400);
            throw new Error('Client already exists');
        }
        const client = await Client.create(req.body);
        if (client){
            generateToken(res, client._id);
            res.status(201).json({
                _id: client._id,
                name: client.name,
                phoneNumber: client.phoneNumber
            })
        } else {
            res.status(400);
            throw new Error('invalid user data')
        }

   

});


const updateClient = asyncHandler( async (req,res) => {
   
    const {id} = req.params;
    const client = await Client.findByIdAndUpdate(id, req.body);

    if(!client){
        return res.status(404).json({message: "Client not found"});
    } 
    const updatedClient = await Client.findById(id);
    res.status(200).json(updatedClient);

});

const deleteClient = asyncHandler( async (req,res) => {

    const {id} = req.params;
    console.log(`hello ${id}`)

    const client = await Client.findByIdAndDelete(id);
    const diet = await DietPlan.findOneAndDelete({user: id})
    const workoutplan = await WorkoutPlan.findOneAndDelete({user: id})
    const subscription = await Subscription.findOneAndDelete({userId: id})

    if(!client){
        return res.status(404).json({message: "Client not found"});
    } 
    res.status(200).json({message:"deleted successfully"});

});

export default{
    fetchClients,  
    fetchClient,  
    addClient, 
    updateClient, 
    authClient,
    logoutClient,
    ClientTokenRefresh,
    deleteClient
};




