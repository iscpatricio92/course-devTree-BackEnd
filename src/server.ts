//const express = require('express'); //CJS Common js
import express from 'express'; //ES6
import router from './router';
const app = express();

//read data form
app.use(express.json());

//Routing
app.use('/',router)

export default app;