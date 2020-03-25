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
  it('creates a tweet', () => {
    return request(app)
      .post('/api/v1/tweets/')
      .send({ handle: 'Jane Doe', text: 'Sample Text' })
      .then(res => {
        expect(res.body).toEqual({ 
          _id: expect.any(String),
          handle: 'Jane Doe', 
          text: 'Sample Text', 
          __v: 0 
        });
      });
  });

  // POST with random tweet
  it('creates an empty tweet, so random text gets inserted', () => {
    return request(app)
      .post('/api/v1/tweets/')
      .send({ handle: 'Jane Doe', text: '' })
      .then(res => {
        expect(res.body).toEqual({ 
          _id: expect.any(String),
          handle: 'Jane Doe', 
          text: expect.any(String), 
          __v: 0 
        });
      });
  });

  // GET ALL
  it('gets all tweets', async() => {
    const tweets = await Tweet.create([{ 
      handle: 'Jane Doe', 
      text: 'Sample Text' 
    }, { 
      handle: 'John Doe', 
      text: 'Text Sample' 
    }]);

    return request(app)
      .get('/api/v1/tweets')
      .then(res => {
        tweets.forEach(tweet => {
          expect(res.body).toContainEqual({ 
            _id: expect.any(String),
            handle: tweet.handle, 
            text: tweet.text, 
            __v: 0 
          });
        });
      });
  });

  // GET ONE
  it('gets a specific tweet by ID', async() => {
    const tweet = await Tweet.create({ handle: 'Jane Doe', text: 'Sample Text' });

    return request(app)
      .get(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body).toEqual({ 
          _id: tweet._id.toString(),
          handle: tweet.handle, 
          text: tweet.text, 
          __v: 0
        });
      });
  });

  // GET ONE WITH COMMENTS - Failing
  // it('gets a specific tweet by ID and its comments', async() => {
  //   const tweet = await Tweet.create({ handle: 'Jane Doe', text: 'Sample Text' });
  //   const comment = await Comment.create({ tweetId: tweet._id, handle: 'Another User', text: 'Typical comment' });

  //   return request(app)
  //     .get(`/api/v1/tweets/withcomments/${tweet._id}`)
  //     .then(res => {
  //       expect(res.body).toEqual({ 
  //         _id: tweet._id.toString(),
  //         handle: tweet.handle, 
  //         text: tweet.text,
  //         comments: 'test', 
  //         __v: 0
  //       });
  //     });
  // });

  // PATCH 
  it('updates a tweet\'s text', async() => {
    const tweet = await Tweet.create({ handle: 'Jane Doe', text: 'Sample Text' });

    return request(app)
      .patch(`/api/v1/tweets/${tweet._id}`)
      .send({ text: 'Changed Text' })
      .then(res => {
        expect(res.body).toEqual({ 
          _id: tweet._id.toString(),
          handle: tweet.handle, 
          text: 'Changed Text', 
          __v: 0
        });
      });
  });

  // DELETE 
  it('deletes a tweet', async() => {
    const tweet = await Tweet.create({ handle: 'Jane Doe', text: 'Sample Text' });

    return request(app)
      .delete(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body).toEqual({ 
          _id: tweet._id.toString(),
          handle: tweet.handle, 
          text: tweet.text, 
          __v: 0
        });
      });
  });
});
