import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  startDate: { type: Date, default: Date.now },
  durationMonths: { type: Number, required: true }, // Duration in months
  endDate: { type: Date },
});

subscriptionSchema.pre('save', function(next) {
  if (!this.endDate) {
    const endDate = new Date(this.startDate);
    endDate.setMonth(endDate.getMonth() + this.durationMonths);
    this.endDate = endDate;
  }
  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
