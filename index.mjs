import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
const port = process.env.PORT || 3003;
const app = express();
import dotenv from 'dotenv';
import cheerio from 'cheerio';
dotenv.config();

app.use(cors());
app.use(express.json());

app.post('/data/', async (req, res) => {
  const { url } = req.body;

  const getChatGPTProject = async (data) => {
    const reqBody =
    {
      "model": "gpt-3.5-turbo-16k",
      "messages": [
        {
          "role": "system",
          "content": `summarize this information from this webpage, make it user friendly and write the summary as if you are explaining what you are reading to a person`,
          "role": "user",
          "content": `${data}`
        }
      ]
    }
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NODE_OPEN_AI_KEY}`,
        'organization': 'org-Sadt7m4oqVOwlJi10NScEkB5'
      },
      body: JSON.stringify(reqBody)
    };
  
    const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
  
    if (response.statusText !== 'OK') {
      throw new Error(`Error ${response.status} - Please try again!`);
    }
  
    return response.json();
  };
  
  try {
    const response = await fetch(url);
    const websiteData = await response.text();
    const $ = cheerio.load(websiteData);
    const paragraphs = $('p').map((i, el) => $(el).text()).get();

    const allParagraphs = paragraphs.join('\n');
    const aiSummary = await getChatGPTProject(allParagraphs);
    
    res.status(200).json({data: aiSummary.choices[0].message.content});

  } catch (error) {
    console.log(error)
    res.status(500).send('Error loading');
  }

})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


