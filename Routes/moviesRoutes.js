const express = require ('express')
const {getAllMovies, getMovie, updateMovie, createMovie, deleteMovie, checkId, validateBody} = require ('../Controllers/moviesController.js')
const router = express.Router();

router.param ('id', checkId)

router.route ('/')
  .get(getAllMovies)
  .post(validateBody, createMovie)  //we can also create an isLoggedIn middleware to check before they can post, sumn like that

router.route ('/:id')
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie)

  module.exports = router;