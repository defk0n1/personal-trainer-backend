import mongoose from "mongoose";
import bcrypt from "bcryptjs"




const weightTrackingSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    weight: { type: Number, required: true }
  });




const ClientSchema = mongoose.Schema({
    fullName : {
        type:String,
        required: [true,"Please enter full name"]
    },
    
    height : {
        type: Number,
        required: [true,"Please enter height"],
        default : 0
        

    },

    weight: {
        type: Number,
        required: [true,"Please enter weight"],
        default : 0

    },

    age : {
        type:Number,
        required: [true,"Please enter age"],
    },
    level : {
        type:String,
        required: [true,"Please enter experience with training"]
    },
    goal:{
        type: String,
        required: [true,"Please enter goal"] 
    },
    active : {
        type:String,
        required: [true, "Please enter activity level"],
    },
    numofMeals: {
        type:Number,
        required: [true, "Please enter preferred number of meals per day"]

    },
    medicalCondition: {
        type:String,
        required : [true, "Please specify any underlying medical conditions or allergies"]
    },

    foodtoAvoid:
    {
        type:String,
        required: [true, "Please specify unpreferred foods" ]
    },
    supplement:
    {
        type:String,
        required: [true,"Specify if willing to use supplements"]
    },
    comment:
    {
        type:String,
        required: [true,"Feel free to add anything"]
    },
    phoneNumber : {
        type:String,
        required: [true,"Please enter phone number"]
    },
    workoutPlan: { type: mongoose.Schema.Types.ObjectId, 
                   ref: 'WorkoutPlan',
                default:null},
    dietPlan: { type: mongoose.Schema.Types.ObjectId, 
                ref: 'DietPlan',
                default:null },

    subscription: { type: mongoose.Schema.Types.ObjectId, 
                ref: 'Subscription',
                default:null },

    weightLogs: [weightTrackingSchema],

    isAdmin : {
        type: Boolean,
        default: false
    },

    password : {
        type: String,
        default : "placeholder"
    }

},
{
    timestamps : true
}
);

ClientSchema.pre('save' , async function (next){
    if (!this.isModified('phoneNumber')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = this.phoneNumber
    this.phoneNumber = await bcrypt.hash(this.phoneNumber, salt);
})



ClientSchema.methods.matchPhoneNumber = async function (enteredNumber){
    return await bcrypt.compare(enteredNumber, this.phoneNumber)
}



const Client = mongoose.model("Client", ClientSchema);

export default Client;

