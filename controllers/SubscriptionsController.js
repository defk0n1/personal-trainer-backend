import Subscription from '../models/subscription.model.js'
import asyncHandler from 'express-async-handler';
import Client from '../models/client.model.js';
import { ObjectId } from 'mongodb';

// Create a new workout plan
const createSubscription = asyncHandler(async (req, res) => {
  const { userId, 
    startDate,
    durationMonths,
    endDate } = req.body;

  // Ensure the userId is provided
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required to create a subscription' });
  }

  const newSubscription = new Subscription({
    userId : userId , 
    startDate,
    durationMonths,
    endDate
  });
   
  const savedSubscription = await newSubscription.save();
  
  const updateClientSubscription = {
    subscription : new ObjectId(savedSubscription.userId)
  }
  const client = await Client.findByIdAndUpdate(userId,updateClientSubscription);
  


  res.status(201).json(savedSubscription);
});

// Get all workout plans for the logged-in user
const getSubscriptions = asyncHandler(async (req, res) => {
  const {id} = req.params 
  const formattedId = new ObjectId(id)
  const clientSubscription= await Subscription.find({ userId:formattedId });
  if (clientSubscription) {
    res.json({
        clientSubscription
    });
  } else {
    res.status(404);
    throw new Error('Subscription not found');
  }});


// Get a workout plan by ID for the logged-in user
const getSubscriptionById = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const subscription = await Subscription.findOne({ _id: req.params.id, userId: id });
  if (subscription) {
    res.status(200).json(subscription);
  } else {
    res.status(404).json({ message: 'Subscription not found' });
  }
});

// Update a Workout plan by ID for the logged-in user
const updateSubscriptionById = asyncHandler(async (req, res) => {
  const updatedSubscription = await Subscription.findOneAndUpdate(
    {userId: req.body.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (updatedSubscription) {
    res.status(200).json(updatedSubscription);
  } else {
    res.status(404).json({ message: 'Subscription not found' });
  }
});

// Delete a workout plan by ID for the logged-in user
const deleteSubscriptionById = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const deletedSubscription = await Subscription.findOneAndDelete({ _id: req.params.id, userId: id });
  if (deletedSubscription) {
    res.status(200).json({ message: 'Subscription deleted' });
  } else {
    res.status(404).json({ message: 'Subscription not found' });
  }
});



export default {
    createSubscription,
    getSubscriptions,
    updateSubscriptionById,
    deleteSubscriptionById
}