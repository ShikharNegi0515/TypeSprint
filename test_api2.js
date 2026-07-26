const http = require('http');

const r = Math.random().toString(36).substring(7);
const data = JSON.stringify({
  email: `test_${r}@example.com`,
  password: 'password123',
  username: `test_${r}`
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    let token = '';
    try {
      const json = JSON.parse(body);
      token = json.access_token;
    } catch(e) {}
    
    if (token) {
      postStats(token);
    } else {
      console.log("Failed to register:", body);
    }
  });
});
req.write(data);
req.end();

function postStats(token) {
  const postData = JSON.stringify({
    wpm: 50,
    rawWpm: 55,
    accuracy: 95,
    mistakes: 2,
    missedChars: {"a": 1},
    characterCount: 250,
    duration: 25,
    mode: "time"
  });

  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/typing/results',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log('POST RESULT:', body));
  });
  req.write(postData);
  req.end();
}
