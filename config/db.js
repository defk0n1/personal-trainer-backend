import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import WorkoutPlan from "../models/workoutplan.model.js";


const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Database connection successful');
      
    } catch (err) {
      console.error('Database connection error:', err);
    }
  };
  
export default connectDB;