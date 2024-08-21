import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reps: { type: String, required: true },
  sets: { type: String, required: true },
  rest: { type: String, required: true } // Rest time in seconds
});


const daySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., "Monday", "Tuesday", etc.
  exercises: [exerciseSchema]
});

const workoutPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  days: [daySchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }

});

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

export default WorkoutPlan;
