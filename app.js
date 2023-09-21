const express = require('express');
const app = express();
const fs = require ('fs');

app.use(express.json())  //always do this when working with json data
//The express. json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser. Parameters: The options parameter have various property like inflate, limit, type, etc.

const movies = JSON.parse(fs.readFileSync('./data/movies.json')); //read only once  that's  why we use readfilesync - then get the json data from the path - then we turn in a javascript object (JSON.parse)

//we want to format it before we send, we use Jsendjson for that { } see. json(laman) below

// ******
// GET  - api/v1/movies
app.get ('/api/v1/movies', (req, res) => {
  res.status(200).json({
    status: "success",
    movieCount: movies.length,
    data: {
      movies: movies
    }
  });
});
//JSEND JSON data  - this way, the client may use data.x when they use the data in the frontend

// ******
// POST - /api/v1/movies
//Create a new movie object
app.post ('/api/v1/movies', (req, res) => {
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
  
})

//we need to use a middleware in order to attach the req.body to the req object
//step 0 - we will use use method and pass the middleware - express.json()
//step 1 - figure out the id (in this case, last data + 1 for now) //const newId = movies[movies.length].id + 1
//step 2 - create a new movie object we have in the req.body + the newId
// const newMovie = Object.assign({id: newId}, newMovie)
//object.assign merges the two
//step 3 - we write the data to the movies json data that we have
// fs.writeFile() //we want to write it asynchronously
//we convert the js object into json object via JSON.stringify
//then the callback function called when writing of data is compelete
//res.status (201) since we create a new object, then we use .json because we wanna send that json as response
//we envelop via jsend json and use newMovie since that's what we want to send
//this works now according to the postman test


// ******
//GET :id
//Handling route params :id , :name, any unique identifier - named URl segments
// /api/v1/movies/:id    -we can also specify multiple value parameters
app.get ('/api/v1/movies/:id', (req, res) => {
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

});

// req.params is just an object saved as string - all route params are property of req object
//id: url value
//optional parameter = '/api/v1/movies/:id/:x?
//Step 1 - turn the id params into a number/integer via PLUS operator const id = +req.params.id or req.params.id * 1 and store it in a variable... parseInt(x) works as well
//Step 2 -  From the movies array of objects, we want to filter via FIND method to find the id
//find method return the movie object that matches our condition - in this case the one that matches our req.params.id
//  movies.find(movie => movie.id === id); - the find function, then store in a variable
//then check IF there is that particular id ->>>
// LOOK AT THE -> if statement for id checking
//then RESpond via sending a json file
//handling errors



// // ******
// https://www.youtube.com/watch?v=-sUdKQjtH5U&list=PL1BztTYDF-QPdTvgsjf8HOwO4ZVl_LhxS&index=37&ab_channel=procademy
// PATCH/PUT REQUEST - patch - only updating one part, put for updating the whole thing
// /api/v1/movies/:id' 
// updating existing resources
app.patch ('/api/v1/movies/:id', (req, res) => {
  const id = +req.params.id;
  const movieToUpdate = movies.find(movie => movie.id === id); //finds the id of the object
  // const index = movies.indexOf(movieToUpdate); //finds the exact object we want to change /unnecessary -this thing still works
  // movies[index] = movieToUpdate //updating the exact movie that we wanna change//unnecessary

  if (!movieToUpdate) {
    return res.status(404).json ({  //make sure to return so it wont run when there's an error
      status: "fail",
      message: `There's no movie with an id of ${id}`
    })
  } else {
    const updatedMovieDetails = Object.assign(movieToUpdate, req.body)
    //this works because we only changing one thing here
    fs.writeFile ('./data/movies.json', JSON.stringify (movies), () => {
      res.status (200).json({
        status: "success",
        data: {
            movie: updatedMovieDetails
        }
      });
  });
  }

});

//patch request is 200 for updating request
//202 for new resource

// This code is a route handler for a PATCH request in a Node.js application, presumably using a web framework like Express. Its primary purpose is to update information about a specific movie and then respond with the updated movie details. Let's break down the code step by step:

// app.patch('/api/v1/movies/:id', (req, res) => { ... }):

// This line defines a route handler for a PATCH request at the endpoint /api/v1/movies/:id. The :id part indicates that the endpoint expects a movie ID as part of the URL.
// const id = +req.params.id;:

// It extracts the movie ID from the route parameters using req.params.id. The + operator is used to convert the id to a number.
// const movieToUpdate = movies.find(movie => movie.id === id);:

// This line searches for a movie in the movies array that has an id property matching the extracted id. It finds the specific movie that needs to be updated.
// const updatedMovieDetails = Object.assign(movieToUpdate, req.body);:

// This line updates the properties of the movieToUpdate object with the data from req.body. It merges the existing movie data (found in movieToUpdate) with the new data sent in the request body (req.body). The result is stored in the updatedMovieDetails variable.
// File Writing:

// fs.writeFile('./data/movies.json', JSON.stringify(movies), () => {
//   res.status(200).json({
//     status: "success",
//     data: {
//       movie: updatedMovieDetails
//     }
//   });
// });
// This part of the code uses the Node.js fs (file system) module to write the entire movies array back to a JSON file named movies.json. It converts the movies array to a JSON string using JSON.stringify before writing it to the file.

// After successfully writing the file, it sends a JSON response to the client with a status of 200 (OK). The response includes the updated movie details in the data property, using the updatedMovieDetails object.

// In summary, this code handles a PATCH request to update a movie's information. It updates the movie object in memory and then writes the entire array of movies back to a JSON file. Finally, it responds to the client with the updated movie details. Note that it doesn't directly update the JSON file; it updates the movie object in memory and then writes the entire array of movies back to the file.





// ******
// DELETE A SPECIFIC RESOURCE
//204 for successful delete request
app.delete ('/api/v1/movies/:id', (req, res) => {
    const id = +req.params.id;
    const movieIdToDelete = movies.find(movie => movie.id === id);

    if (!movieIdToDelete){
      return res.status(404).json ({  
        status: "fail",
        message: `There's no movie with an id of ${id} or this resource has already been deleted`
      })

    }  else {
      const index = movies.indexOf(movieIdToDelete)
      movies.splice(index, 1)  //this mutates the original array

    fs.writeFile('./data/movies.json', JSON.stringify(movies), () => {
      res.status(204).json({
          status: "success",
          data: {
              movie: null
          }
      })
  })
    };

});



//step 1 - idenfify our req.params.id
//step 2 - find the movieID to delete via FIND comparing the params id that matches the url and the one in the database
//step  3 - send and return status 404 if no id was found !movieIdtoDelete (undefined)
//step 4 - find the index of the movies.indexOf(movieIdtoDelete) id
//step 5 -  splice the array byt passing the index and the number of property we want to delete
//splice mutates the original array
//step 6 - we dont need to send any data for a delete request











// ******
//create a server

const PORT = 3000;
app.listen (PORT, () => {
  console.log(`server is running on port ${PORT}`)
});
