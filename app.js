const express = require('express');
const app = express();
const fs = require ('fs');
const movies = JSON.parse(fs.readFileSync('./data/movies.json'));
const morgan = require ('morgan');

app.use(express.json()) //for getting req.body req params 

//3rd party middleware
app.use(morgan('dev')) //calling it because these functions are going to return a function and they will act as a middleware - they return a middleware function

//custom middleware
const logger = (req, res, next) => {
  console.log(`this is a custom middleware`)
  next() //we need this so it will move on to the next middleware
}
app.use(logger)


//e.g. we need to find out when the req was made

const requestTime = (req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
  //remember, requestedAt or any after the req is just an object
}

app.use (requestTime)


//functions
const getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestedAt,
    movieCount: movies.length,
    data: {
      movies: movies
    }
  });
};

const getMovie = (req, res) => {
  const id = +req.params.id
  //find movie based on id parameter
  //this returns a value of undefined if no match was find
  const oneMovie = movies.find(movie => movie.id === id);

  //if statement for id checking - !oneMovie - if undefined return this:
  if (!oneMovie) {
    return res.status(404).json({
      status: "failed request",
      message: `movie with id of ${id} not found`
    })
  } else {
    res.status(200).json({
      status:"success",
      data: {
        movie:oneMovie
      }
    })
  };
};

const createMovie = (req, res) => {
  const newMovie = req.body;
  const newId = movies[movies.length -1].id + 1;
  const updatedMovies = Object.assign({id: newId}, newMovie)
  //const updatedMovies = { id: newId, ...newMovie }; - as substitute
  movies.push(updatedMovies) //putting the updatedMovie to movies

  //Updating the database and sending json as response
  fs.writeFile('./data/movies.json', JSON.stringify (movies), () => {
      res.status (201).json({
        status: "success",
        data: {
            movie: newMovie
        }
      });
  });
};

const updateMovie = (req, res) => {
  const id = +req.params.id;
  const movieToUpdate = movies.find(movie => movie.id === id);

  if (!movieToUpdate) {
    return res.status(404).json ({ 
      status: "fail",
      message: `There's no movie with an id of ${id}`
    })
  } else {
    const updatedMovieDetails = Object.assign(movieToUpdate, req.body)

    fs.writeFile ('./data/movies.json', JSON.stringify (movies), () => {
      res.status (200).json({
        status: "success",
        data: {
            movie: updatedMovieDetails
        }
      });
  });
  }
};

const deleteMovie = (req, res) => {
  const id = +req.params.id;
  const movieIdToDelete = movies.find(movie => movie.id === id);

  if (!movieIdToDelete){
    return res.status(404).json ({  
      status: "fail",
      message: `There's no movie with an id of ${id} or this resource has already been deleted`
    })

  }  else {
    const index = movies.indexOf(movieIdToDelete)
    movies.splice(index, 1)

  fs.writeFile('./data/movies.json', JSON.stringify(movies), () => {
    res.status(204).json({
        status: "success",
        data: {
            movie: null
        }
    })
})
  };
};

//BOTH WORKS

//METHOD 1 - one by one
// app.get ('/api/v1/movies', getAllMovies);
// app.get ('/api/v1/movies/:id', getMovie);
// app.post ('/api/v1/movies', createMovie)
// app.patch ('/api/v1/movies/:id', updateMovie);
// app.delete ('/api/v1/movies/:id', deleteMovie);

const moviesRouter = express.Router();
app.use('/api/v1/movies', moviesRouter) //middleware will only be applied to this link

//METHOD 2 CHAINING
moviesRouter.route ('/')  //we need to remove this whole path cause we are already appending
  .get(getAllMovies)
  .post(createMovie)

moviesRouter.route ('/:id')  //we need to remove this whole path cause we are already appending from our app.use   ...except from /:id - in our router app use we have: app.use('/api/v1/movies', moviesRouter)
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie)

//create and listen to a server
const PORT = 3000;
app.listen (PORT, () => {
  console.log(`server is running on port ${PORT}`)
});
