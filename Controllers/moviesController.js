const fs = require ('fs');
const movies = JSON.parse(fs.readFileSync('./data/movies.json'));

//check id middleware
const checkId = (req, res, next, value) => {
  console.log(`movie id is ${value}`)
  const oneMovie = movies.find(movie => movie.id === +value);

  if (!oneMovie) {
    return res.status(404).json({
      status: "failed request",
      message: `movie with id of ${value} not found`
    })
  } 
  next()
}
//no need for .use cause we have this router.param ('id', checkId) in the moviRoutes.js
//the middleware above runs before the get post patch delete functions


//validation req.body middleware

const validateBody = (req, res, next) => {

  const {title, releaseYear, duration} = req.body;

  if (!title || !releaseYear || !duration) {   //if all of these props are in the req.body, then it will go to next()
    return res.status(400).json ({
      status: "fail",
      message:"please provide the title, the release year, and the duration of the movie"
    })  
  };
  
  next();
}


const getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    movieCount: movies.length,
    data: {
      movies: movies
    }
  });
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

const getMovie = (req, res) => {
  const id = +req.params.id
  const oneMovie = movies.find(movie => movie.id === id);
  
  //there was the checkId function here replaces automatically w/ the checkId middleware
    res.status(200).json({
      status:"success",
      data: {
        movie:oneMovie
      }
    })
};

const updateMovie = (req, res) => {
  const id = +req.params.id;
  const movieToUpdate = movies.find(movie => movie.id === id);

  // if (!movieToUpdate) {
  //   return res.status(404).json ({ 
  //     status: "fail",
  //     message: `There's no movie with an id of ${id}`
  //   })
  // } else {
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
// };

const deleteMovie = (req, res) => {
  const id = +req.params.id;
  const movieIdToDelete = movies.find(movie => movie.id === id);

  // if (!movieIdToDelete){
  //   return res.status(404).json ({  
  //     status: "fail",
  //     message: `There's no movie with an id of ${id} or this resource has already been deleted`
  //   })

  // }  
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


module.exports= {
  getAllMovies, getMovie, updateMovie, createMovie, deleteMovie, checkId, validateBody
}