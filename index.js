const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const app = express();
const { Configuration, OpenAI } = require('openai');

// const newConfig = new Configuration({
//   apiKey: dotenv.parsed.KEY
// })

const openai = new OpenAI()

console.log('dotenv', dotenv.parsed.OPENAI_API_KEY)

app.use(cors());

app.get('/', async (req, res) => {
  try{

    const GPTOutpt = await openai.chat.completions.create({
      messages: [{'role': 'user', 'content': 'Say this is a test!'}],
      model: 'gpt-3.5-turbo',
    })

    const text = GPTOutpt.choices[0];

    console.log('text', text)

    res.send(text)
    // await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'post',
    //   headers: {
    //     'Authorization': `Bearer ${dotenv.parsed.KEY}`
    //   }
    // }).then(response => response.json())
    // .then(json => res.send(json))
  } catch(err){
    console.log(err)
  }
});

app.get('/gpt', async(req, res) => {
  try{
    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${dotenv.parsed.KEY}`
      }
    }).then(response => response.json())
    .then(json => res.send(json))
  } catch(err){
    console.log(err)
  }
})

app.listen(3001, () => {
    console.log('Express server listening on port 3001')
});

