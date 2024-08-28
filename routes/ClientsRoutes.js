import express from 'express'

import clientsController from "../controllers/ClientsController.js"
import DietsController from "../controllers/DietsController.js"
import WeightController from '../controllers/WeightController.js';
import WorkoutplansController from '../controllers/WorkoutplansController.js';
import SubscriptionsController from '../controllers/SubscriptionsController.js';

import { protect , isSubscribed , isAdmin} from '../middleware/authMiddleware.js';

const clientRouter = express.Router();

clientRouter.post('/',clientsController.addClient ) ;
clientRouter.post('/auth',clientsController.authClient );
clientRouter.post('/logout',protect,clientsController.logoutClient );
clientRouter.get('/auth/refresh',clientsController.ClientTokenRefresh) ; 
clientRouter.get('/',protect, isAdmin, clientsController.fetchClients); //isAdmin,
clientRouter.get('/:id', protect ,isSubscribed ,clientsController.fetchClient)
clientRouter.delete('/:id', protect , isAdmin, clientsController.deleteClient); //isAdmin,


clientRouter.route('/profile').get(protect,clientsController.fetchClient).put(protect , clientsController.updateClient);

//WEIGHT LOGGING ROUTES

clientRouter.get('/weights',protect ,isSubscribed,WeightController.getWeightLogs)
clientRouter.post('/weights/:id',protect ,WeightController.addWeightLog)
clientRouter.patch('/weights/:id',protect ,WeightController.resetWeights)

//DIET ROUTES

clientRouter.post('/diets', protect, isAdmin,  isSubscribed,DietsController.createDietPlan);//isAdmin,
clientRouter.get('/diets/:id', protect , isSubscribed,DietsController.getAllDietPlans);
clientRouter.patch('/diets/', protect, isSubscribed,DietsController.updateDietPlanById);
clientRouter.delete('/diets/:id', protect, isAdmin,  isSubscribed,DietsController.deleteDietPlanById);//isAdmin,


// WORKOUTS ROUTES

clientRouter.post('/workoutplans', protect, isAdmin, isSubscribed,WorkoutplansController.createWorkoutPlan); //isAdmin,
clientRouter.get('/workoutplans/:id', protect, isSubscribed,WorkoutplansController.getAllWorkoutPlans);
clientRouter.patch('/workoutplans/', protect, isSubscribed,WorkoutplansController.updateWorkoutPlanById);
clientRouter.delete('/workoutplans/:id', protect,isSubscribed,WorkoutplansController.deleteWorkoutPlanById);



// SUBSCRIPTION ROUTES

clientRouter.post('/subscriptions', protect,isAdmin,  SubscriptionsController.createSubscription);// isAdmin,
clientRouter.get('/subscriptions/:id', protect, SubscriptionsController.getSubscriptions);
clientRouter.patch('/subscriptions/', protect, SubscriptionsController.updateSubscriptionById);
clientRouter.delete('/subscriptions/:id', protect, SubscriptionsController.deleteSubscriptionById);











export default clientRouter;