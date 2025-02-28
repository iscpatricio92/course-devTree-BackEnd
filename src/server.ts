//const express = require('express'); //CJS Common js
import express from 'express'; //ES6
import 'dotenv/config';
import router from './router';
import { connectDB } from './config/db';
import cors from 'cors';
import { corsConfig } from './config/cors';
const app = express();
connectDB();
//read data form
app.use(express.json());

//CORS
app.use(cors(corsConfig));

//Routing
app.use('/',router)

export default app;