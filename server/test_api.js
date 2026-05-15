const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = '2l1SIvkOePElVWd0UC9MeQ==';

async function test() {
  const token = jwt.sign({ id: '60d5ecb8b392d700153ee000', user: { id: '60d5ecb8b392d700153ee000' } }, JWT_SECRET);
  console.log('Generated token:', token);
  
  try {
    const res = await axios.get('http://localhost:1337/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.log('API Error:', err.response ? err.response.data : err.message);
  }
}

test();
