const mongoose = require ('mongoose');
const request = require('superagent');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: false
  }
});

tweetSchema.pre('save', async function(next) {
  if(this.text.length) return next();
  // empty tweet - let's add a random quote
  else {
    const response = await request.get('http://futuramaapi.herokuapp.com/api/quotes/1');
    const futuramaQuote = response.body[0];  
    this.text = `"${futuramaQuote.quote}" —${futuramaQuote.character}`;
    console.log(this.text);
    next();
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);
