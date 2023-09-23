const express = require ('express')
const {getAllMovies, getMovie, updateMovie, createMovie, deleteMovie} = require ('../Controllers/moviesController')
const router = express.Router();

router.route ('/')
  .get(getAllMovies)
  .post(createMovie)

router.route ('/:id')
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie)

  module.exports = router;