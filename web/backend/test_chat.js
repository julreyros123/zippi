const fetch = require('node-fetch');

async function testChat() {
  const token = process.argv[2];
  if (!token) {
    console.error('Please provide a token');
    return;
  }

  // 1. Get channels
  const channelsRes = await fetch('http://localhost:5000/api/channels', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const channels = await channelsRes.json();
  console.log('Channels:', channels);

  if (channels.length === 0) {
    console.error('No channels available');
    return;
  }

  const activeChannel = channels[0].id;
  console.log(`Active channel: ${activeChannel}`);

  // 2. Send message
  const FormData = require('form-data');
  const formData = new FormData();
  formData.append('content', 'Test message from script');

  const res = await fetch(`http://localhost:5000/api/channels/${activeChannel}/messages`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${token}`,
      // FormData gets headers correctly automatically
    },
    body: formData
  });

  const text = await res.text();
  console.log('Create message response:', res.status, text);
}

testChat();
