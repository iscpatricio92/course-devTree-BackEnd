const express = require('express');
const app = express();

//Routing
app.get('/', (req, res) => {
  res.send('Hello World Express!');
});

app.get('/ecommerce', (req, res) => {
  res.send('Welcome to the E-commerce website');
});

app.listen(4000, () => {
  console.log('Server is running on port 3000');
});