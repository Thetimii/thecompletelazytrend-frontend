const axios = require('axios');

async function testApi() {
  try {
    const response = await axios.get('http://localhost:5001/api/test');
    console.log('API response:', response.data);
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testApi();
