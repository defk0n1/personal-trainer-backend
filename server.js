import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import ClientRouter from "./routes/ClientsRoutes.js"

import path from "path"


import cookieParser from "cookie-parser"
import { notFound , errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors({credentials: true,   origin : 'https://personal-trainer-7mmf.onrender.com' 
}));
    // {
   
    //   origin : 'http://localhost:3000'
    // }
 
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(cookieParser());
// API ROUTES
app.use('/api/clients', ClientRouter);

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
  } else {
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
  }
  
//MIDDLEWARE
app.use(notFound);
app.use(errorHandler);

app.listen(port,() => {
    console.log('server running on port 5000');
});


