import asyncHandler from 'express-async-handler';
import Client from '../models/client.model.js';


const addWeightLog = asyncHandler(async (req,res) => {
    const {weight , date} = req.body;
    console.log(req.body)
    const {id} = req.params

    if (!weight || !date){
        res.status(400).json({message : "all fields required"});
    }

    const client = await Client.findById(id);

     if (!client) {
            return res.status(404).json({ message: 'User not found' });
    }

    client.weightLogs.push({ date, weight });
    await client.save();

    res.status(201).json(client.weightLogs);
})



const getWeightLogs = asyncHandler(async (req, res) => {
    const client = await Client.findById(req.user._id);
    res.status(201).json(client.weightLogs);

})


const resetWeights = asyncHandler(async (req,res) => {

    console.log(`hello ${req.user._id}`)
    const {id} = req.params


    const client = await Client.findById(id);

     if (!client) {
            return res.status(404).json({ message: 'User not found' });
    }

    if(!client.weightLogs){
        return res.status(404).json({ message: 'Weights logs already null' });


    }
    client.set({ weightLogs : []});
    await client.save();

    res.status(201).json(client);
})

export default {
    addWeightLog,
    getWeightLogs,
    resetWeights

}



