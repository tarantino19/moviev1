const express = require('express');
const app = express();
const fs = require ('fs');

app.use(express.json())

const movies = JSON.parse(fs.readFileSync('./data/movies.json'));

const getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
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

//METHOD 2 CHAINING
app.route ('/api/v1/movies')
  .get(getAllMovies)
  .post(createMovie)

app.route ('/api/v1/movies/:id')
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie)

//create and listen to a server
const PORT = 3000;
app.listen (PORT, () => {
  console.log(`server is running on port ${PORT}`)
});
