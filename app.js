const express = require('express');
const app = express();
const morgan = require ('morgan');
const moviesRouter = require ('./Routes/moviesRoute')

app.use(express.json())
app.use(morgan('dev')) 

app.use('/api/v1/movies', moviesRouter) 

module.exports = app;