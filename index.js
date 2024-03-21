const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const app = express();
const { Configuration, OpenAI } = require('openai');


const openai = new OpenAI()

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello from express!')
})

app.post('/gpt', async (req, res, next) => {
  console.log('REQ', req.body)
  const ingredients = req.body.ingredientList;
  try{
      const GPTOutpt = await openai.chat.completions.create({
      messages: [
        {'role' : 'system', 'content': 'You are a helpful assistant designed to suggest recipes based on available ingredients.'},
        {'role': 'user', 'content': `What kind of recipe can I make with these ingredients? ${ingredients}`},
      ],
      model: 'gpt-3.5-turbo',
    })

    console.log('GPTOUT', GPTOutpt)
    const text = GPTOutpt.choices[0].message.content;

    res.send(text)

  } catch(err){
    next(err)
  }
});

// app.get('/gpt', async(req, res) => {
//   try{
//     await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'get',
//       headers: {
//         'Authorization': `Bearer ${dotenv.parsed.KEY}`
//       }
//     }).then(response => response.json())
//     .then(json => res.send(json))
//   } catch(err){
//     console.log(err)
//   }
// })

app.listen(3001, () => {
    console.log('Express server listening on port 3001')
});

