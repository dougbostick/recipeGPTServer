const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const app = express();
const { Configuration, OpenAI } = require('openai');


const openai = new OpenAI()

app.use(cors({
  origin: 'http://localhost:3000/'
}));
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello from express!')
})

app.post('/gpt', async (req, res, next) => {
  console.log('REQ', req.body)

  const ingredients = req.body.ingredientList;
  const jsonFormat = `
    Format the response as an array named recipes, where each item in the array is a recipe in the following JSON format: 
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
          {'role' : 'system', 'content': `You are a helpful assistant designed to suggest a list of 3-10 recipes based on available ingredients. 
          If any of the provided ingredients is not recognized as food then reply with a message asking for edible ingredients. ${jsonFormat}`},
          {'role': 'user', 'content': `What kind of recipe can I make with these ingredients? ${ingredients}`},
        ],
        response_format: {"type": "json_object"}
      })

    console.log('GPTOUT', GPTOutpt)
    const text = GPTOutpt.choices[0].message.content;
    console.log(text)
    res.send(text)

  } catch(err){
    next(err)
  }
});

app.post('/gptAssist', async (req, res, next) => {
  console.log('REQ', req.body)

  const question = req.body.input;
  const jsonFormat = `
    JSON format: 
    {
      response: <response>
    }
  `
  const unrelatedMessage = `JSON Response: {
    error: <reply with your choice of text informing the use that you are only knowledgable in culinary topics>
  }`

  const incompleteQuestion = `JSON Response: {
    error: <reply with your choice of text informing the user that was not a complete question>
  }`
  try{
      const GPTOutpt = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {'role' : 'system', 'content': `You are a helpful assistant designed to suggest answer questions about food, cooking and other culinary subjects. 
       
          Reply to this question: ${question} in this format: ${jsonFormat}`},
          // {'role': 'user', 'content': `${question}`},
        ],
        response_format: {"type": "json_object"}
      })

    console.log('GPTOUT', GPTOutpt)
    const text = GPTOutpt.choices[0].message.content;
    console.log(text)
    res.send(text)

  } catch(err){
    next(err)
  }
});

app.listen(3001, () => {
    console.log('Express server listening on port 3001')
});



// If you are asked an incomplete question repy with the following JSON format:${incompleteQuestion}.
// If you are asked an unrelated question reply with the following JSON format: ${unrelatedMessage}. 