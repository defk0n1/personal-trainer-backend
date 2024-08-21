import mongoose from "mongoose";

const mealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true }
});

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true }, // e.g., "Breakfast", "Lunch"
  items: [mealItemSchema]
});

const dietPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  meals: [mealSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }

});

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

export default DietPlan;
