import DietPlan from '../models/dietplan.model.js';
import asyncHandler from 'express-async-handler';
import Client from '../models/client.model.js';
import { ObjectId } from 'mongodb';

// Create a new diet plan
const createDietPlan = asyncHandler(async (req, res) => {
  const { userId, name, description, meals } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required to create a diet plan' });
  }
  const newDietPlan = new DietPlan({
    name,
    description,
    meals,
    user: userId
  });
  const savedDietPlan = await newDietPlan.save();


  const updateClientDietPlan = {
    dietPlan : new ObjectId(savedDietPlan.user)
  }
  const client = await Client.findByIdAndUpdate(userId,updateClientDietPlan);
  

  

  res.status(201).json(savedDietPlan);
});

// Get all diet plans for the logged-in user
const getAllDietPlans = asyncHandler(async (req, res) => {
  const {id} = req.params 
  const formattedId = new ObjectId(id)
  const dietPlan = await DietPlan.find({ user:formattedId });
  if (dietPlan) {
    res.json({
      dietPlan
    });
  } else {
    res.status(404);
    throw new Error('Diet plan not found');
  }});




// Update a diet plan by ID for the logged-in user
const updateDietPlanById = asyncHandler(async (req, res) => {
  const updatedDietPlan = await DietPlan.findOneAndUpdate(
    {user: req.body.user },
    req.body,
    { new: true, runValidators: true }
  );
  if (updatedDietPlan) {
    res.status(200).json(updatedDietPlan);
  } else {
    res.status(404).json({ message: 'Diet plan not found' });
  }
});

// Delete a diet plan by ID for the logged-in user
const deleteDietPlanById = asyncHandler(async (req, res) => {
  const deletedDietPlan = await DietPlan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (deletedDietPlan) {
    res.status(200).json({ message: 'Diet plan deleted' });
  } else {
    res.status(404).json({ message: 'Diet plan not found' });
  }
});

export default {
    createDietPlan,
    getAllDietPlans,
    updateDietPlanById,
    deleteDietPlanById
}
