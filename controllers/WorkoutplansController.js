import WorkoutPlan from '../models/workoutplan.model.js'
import asyncHandler from 'express-async-handler';
import Client from '../models/client.model.js';
import { ObjectId } from 'mongodb';

// Create a new workout plan
const createWorkoutPlan = asyncHandler(async (req, res) => {
  const { userId, name, description, days } = req.body;

  // Ensure the userId is provided
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required to create a workout plan' });
  }

  const newWorkoutPlan = new WorkoutPlan({
    name,
    description,
    days,
    user: userId
  });
   
  const savedWorkoutPlan = await newWorkoutPlan.save();
  
  const updateClientWorkoutPlan = {
    workoutPlan : new ObjectId(savedWorkoutPlan.user)
  }
  const client = await Client.findByIdAndUpdate(userId,updateClientWorkoutPlan);
  


  res.status(201).json(savedWorkoutPlan);
});

// Get all workout plans for the logged-in user
const getAllWorkoutPlans = asyncHandler(async (req, res) => {
  const {id} = req.params 
  const formattedId = new ObjectId(id)
  const clientWorkoutPlan = await WorkoutPlan.find({ user:formattedId });
  if (clientWorkoutPlan) {
    res.json({
      clientWorkoutPlan
    });
  } else {
    res.status(404);
    throw new Error('Workout plan not found');
  }});


// Get a workout plan by ID for the logged-in user
const getWorkoutPlanById = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const workoutPlan = await WorkoutPlan.findOne({ _id: req.params.id, user: id });
  if (workoutPlan) {
    res.status(200).json(workoutPlan);
  } else {
    res.status(404).json({ message: 'Workout plan not found' });
  }
});

// Update a Workout plan by ID for the logged-in user
const updateWorkoutPlanById = asyncHandler(async (req, res) => {
  const updatedWorkoutPlan = await WorkoutPlan.findOneAndUpdate(
    {user: req.body.user },
    req.body,
    { new: true, runValidators: true }
  );
  if (updatedWorkoutPlan) {
    res.status(200).json(updatedWorkoutPlan);
  } else {
    res.status(404).json({ message: 'Workout plan not found' });
  }
});

// Delete a workout plan by ID for the logged-in user
const deleteWorkoutPlanById = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const deletedWorkoutPlan = await WorkoutPlan.findOneAndDelete({ _id: req.params.id, user: id });
  if (deletedWorkoutPlan) {
    res.status(200).json({ message: 'Workout plan deleted' });
  } else {
    res.status(404).json({ message: 'Workout plan not found' });
  }
});



export default {
    createWorkoutPlan,
    getAllWorkoutPlans,
    updateWorkoutPlanById,
    deleteWorkoutPlanById
}