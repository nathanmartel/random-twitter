const Router = require('express');
const Comment = require('../models/Comment');

module.exports = Router() 

  // `POST /api/v1/comments` to create a new comment
  .post('/', (req, res, next) => {
    Comment
      .create(req.body)
      .then(comment => res.send(comment))
      .catch(next);
  })
  
  // `GET /api/v1/comments` to get all comments
  .get('/', (req, res, next) => {
    Comment
      .find()
      .then(comment => res.send(comment))
      .catch(next);
  })  

  // `GET /api/v1/comments/:id` to get a comment by ID
  .get('/:id', (req, res, next) => {
    Comment
      .findById(req.params.id)
      .then(comment => res.send(comment))
      .catch(next);
  })  
    
  // `PATCH /api/v1/comments/:id` to update a comments text **ONLY**
  .patch('/:id', (req, res, next) => {
    Comment
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(comment => res.send(comment))
      .catch(next);
  })  
      
  // `DELETE /api/v1/comments/:id` to delete a comment
  .delete('/:id', (req, res, next) => {
    Comment
      .findByIdAndDelete(req.params.id)
      .then(comment => res.send(comment))
      .catch(next);
  });

