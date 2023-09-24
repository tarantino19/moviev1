const express = require('express');
const app = express();
const morgan = require ('morgan');
const moviesRouter = require ('./Routes/moviesRoutes')

app.use(express.json())

if (process.env.NODE_ENV === 'development'){
  app.use(morgan('dev')) 
}

app.use(express.static('./public'))
app.use('/api/v1/movies', moviesRouter) 

module.exports = app;


//sending an html file - e.g. 404 error , a page or something
// app. get('/', (req, res) => {
//   res. sendFile(path. join(__dirname, 'index.html'));

