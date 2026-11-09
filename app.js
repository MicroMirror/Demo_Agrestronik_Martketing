const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// 首页健康检查
app.get('/', (req, res) => {
  res.send('Agres Meta Webhook Service is running');
});

// Meta Webhook 验证接口
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  console.log('Webhook verification request:', {
    mode,
    tokenMatched: token === VERIFY_TOKEN,
    challengeReceived: !!challenge
  });

  if (mode === 'subscribe' &&
      token === VERIFY_TOKEN &&
      challenge) {
    console.log('WEBHOOK_VERIFIED');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Meta Webhook 接收消息接口
app.post('/webhook', (req, res) => {
  console.log('Webhook event received');

  console.log(JSON.stringify(req.body, null, 2));

  return res.sendStatus(200);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
