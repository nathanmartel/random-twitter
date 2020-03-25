const mongoose = require ('mongoose');
const Router = require('express');
const Tweet = require('../models/Tweet');
const Comment = require('../models/Comment');

module.exports = Router() 

  // `POST /api/v1/tweets` to create a new tweet
  .post('/', (req, res, next) => {
    Tweet
      .create(req.body)
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  
  // `GET /api/v1/tweets` to get all tweets
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  
  // `GET /api/v1/tweets/:id` to get a tweet by ID
  .get('/:id', (req, res, next) => {
    Tweet
      .findById(req.params.id)
      .then(tweet => res.send(tweet))
      .catch(next);
  })

  // `GET /api/v1/tweets/withcomments/:id` to get a tweet by ID and its comments
  .get('/withcomments/:id', (req, res, next) => {
    Tweet
      .aggregate([
        { 
          $match: { _id: mongoose.Types.ObjectId(req.params.id) } 
        }, 
        { 
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'tweetId',
            as: 'tweetComments'
          }
        }
      ])
      .then(tweet => res.send(tweet))
      .catch(next);
  })  
  
  // `PATCH /api/v1/tweets/:id` to update a tweets text **ONLY**
  .patch('/:id', (req, res, next) => {
    Tweet
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(tweet => res.send(tweet))
      .catch(next);
  })
      
  // `DELETE /api/v1/tweets/:id` to delete a tweet
  .delete('/:id', (req, res, next) => {
    Tweet
      .findByIdAndDelete(req.params.id)
      .then(tweet => res.send(tweet))
      .catch(next);
  });

