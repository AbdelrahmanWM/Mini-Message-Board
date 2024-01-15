const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const path = require('path');

const messagesFilePath = path.join(__dirname, '../storage', 'messages.json');

// Function to read messages from the file or initialize with default messages
const readMessages = async () => {
  try {
    const data = await fs.readFile(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, initialize with default messages
    return [
      {
        text: "Hi there!",
        user: "Amando",
        added: new Date().toISOString(),
      },
      {
        text: "Hello World!",
        user: "Charles",
        added: new Date().toISOString(),
      },
    ];
  }
};

// Function to write messages to the file
const writeMessages = async (messages) => {
  await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
};

/* GET home page. */
router.get('/', async function (req, res, next) {
  const messages = await readMessages();
  res.render('index', { title: 'Mini Message Board', messages: messages });
});

router.post('/new', async function (req, res, next) {
  const messages = await readMessages();
  const message = {
    user: req.body.user,
    text: req.body.text,
    added: new Date().toISOString(),
  };
  messages.push(message);
  await writeMessages(messages);
  res.redirect('/');
});

module.exports = router;
