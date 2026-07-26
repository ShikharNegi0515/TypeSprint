const http = require('http');

const data = JSON.stringify({
  email: 'test999@example.com',
  password: 'password123',
  username: 'test999'
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
    
    if (!token) {
      const req2 = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, (res2) => {
        let body2 = '';
        res2.on('data', d => body2 += d);
        res2.on('end', () => {
          const json2 = JSON.parse(body2);
          token = json2.access_token;
          postStats(token);
        });
      });
      req2.write(data);
      req2.end();
    } else {
      postStats(token);
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
