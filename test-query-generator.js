const axios = require('axios');
require('dotenv').config();

async function testQueryGenerator() {
  try {
    console.log('Testing query generator...');
    
    const businessDescription = "coffee shop";
    
    const response = await axios.post('http://localhost:5001/api/generate-queries', {
      businessDescription
    });
    
    console.log('API Response:', response.data);
    
    if (response.data.success) {
      console.log('Generated queries:', response.data.data.searchQueries);
    }
  } catch (error) {
    console.error('Error testing query generator:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testQueryGenerator();
