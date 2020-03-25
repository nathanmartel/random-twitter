require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const Comment = require('../lib/models/Comment');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  
  // POST
  it('creates a comment', async() => {
    const tweet = await Tweet.create({ handle: 'Jane Doe', text: 'Sample Text' });

    return request(app)
      .post('/api/v1/comments/')
      .send({ tweetId: tweet._id, handle: 'Another User', text: 'Typical comment' })
      .then(res => {
        expect(res.body).toEqual({ 
          _id: expect.any(String),
          tweetId: tweet._id.toString(),
          handle: 'Another User', 
          text: 'Typical comment', 
          __v: 0 
        });
      });
  });

  // GET ONE
  // Don't quite understand the lab instructions re: 'and populate a tweet' with the GET route? 
  it('gets a specific comment by ID', async() => {
    const tweet = await Tweet.create({ handle: 'Jane Doe', text: 'Sample Text' });
    const comment = await Comment.create({ tweetId: tweet._id, handle: 'Another User', text: 'Typical comment' });

    return request(app)
      .get(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({ 
          _id: comment._id.toString(),
          tweetId: tweet._id.toString(),
          handle: comment.handle, 
          text: comment.text, 
          __v: 0
        });
      });
  });

  // PATCH 
  it('updates a comment\'s text', async() => {
    const tweet = await Tweet.create({ handle: 'Jane Doe', text: 'Sample Text' });
    const comment = await Comment.create({ tweetId: tweet._id, handle: 'Another User', text: 'Typical comment' });

    return request(app)
      .patch(`/api/v1/comments/${comment._id}`)
      .send({ text: 'Changed comment' })
      .then(res => {
        expect(res.body).toEqual({ 
          _id: comment._id.toString(),
          tweetId: tweet._id.toString(),
          handle: comment.handle, 
          text: 'Changed comment', 
          __v: 0
        });
      });
  });

  // DELETE 
  it('deletes a comment', async() => {
    const tweet = await Tweet.create({ handle: 'Jane Doe', text: 'Sample Text' });
    const comment = await Comment.create({ tweetId: tweet._id, handle: 'Another User', text: 'Typical comment' });

    return request(app)
      .delete(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({ 
          _id: comment._id.toString(),
          tweetId: tweet._id.toString(),
          handle: comment.handle, 
          text: comment.text, 
          __v: 0
        });
      });
  });
});
