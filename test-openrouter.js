const axios = require('axios');
require('dotenv').config(); // Load from root .env file

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function testOpenRouter() {
  try {
    console.log('Using API Key:', OPENROUTER_API_KEY ? 'API key is set' : 'API key is missing');

    const businessDescription = "coffee shop";

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Generate 5 specific TikTok search queries for a ${businessDescription} business. These should be queries that would return viral or trending content that shows successful marketing strategies in this niche. Return ONLY the search queries as a JSON array of strings, nothing else.`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://thecompletelazytrend.com',
          'X-Title': 'The Complete Lazy Trend'
        }
      }
    );

    console.log('API Response:', response.data);

    // Extract the generated queries from the response
    const content = response.data.choices[0].message.content;
    console.log('Raw content from model:', content);

    // Try to parse as JSON
    try {
      const queries = JSON.parse(content);
      console.log('Parsed queries:', queries);
    } catch (error) {
      console.log('Error parsing JSON, trying alternative methods');
      // If parsing fails, try to extract array using regex
      const match = content.match(/\[.*\]/s);
      if (match) {
        console.log('Found array using regex:', match[0]);
        const queries = JSON.parse(match[0]);
        console.log('Parsed queries:', queries);
      } else {
        console.log('Could not parse as JSON');
      }
    }
  } catch (error) {
    console.error('Error testing OpenRouter API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testOpenRouter();
