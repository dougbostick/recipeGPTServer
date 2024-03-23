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
  const jsonFormat = `
    Format the response as an array where each item in the array is a recipe in the following JSON format: 
    {
      recipe: <title of recipe>,
      ingredients: <unordered list of required ingredients>,
      steps: <ordered list of the steps required to follow recipe>
    }
  `
  try{
      const GPTOutpt = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {'role' : 'system', 'content': `You are a helpful assistant designed to suggest a list of 3-10 recipes based on available ingredients. ${jsonFormat}`},
          {'role': 'user', 'content': `What kind of recipe can I make with these ingredients? ${ingredients}`},
        ],
        response_format: {"type": "json_object"}
      })

    console.log('GPTOUT', GPTOutpt)
    const text = GPTOutpt.choices[0].message.content;
    
    res.send(text)

  } catch(err){
    next(err)
  }
});

// app.post('/gptembed', async (req, res, next) => {
//   console.log('REQ', req.body)
//   const ingredients = req.body.ingredientList;
//   try{
//       const GPTOutpt = await openai.embeddings.create({
//       model: 'text-embedding-ada-002',
//       input: `Suggest a recipe based on these ingredients: ${ingredients}.`,
//       encoding_format: 'float'
//     })

//     console.log('GPTOUT', GPTOutpt)
   

//     res.send(GPTOutpt)

//   } catch(err){
//     next(err)
//   }
// });


app.listen(3001, () => {
    console.log('Express server listening on port 3001')
});

