const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');
const apiKeyContainer = document.getElementById('api-key-container');

let OPENAI_API_KEY = null;

saveApiKeyBtn.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (!key.startsWith('sk-')) {
    alert('Please enter a valid OpenAI API key starting with "sk-".');
    return;
  }
  OPENAI_API_KEY = key;
  apiKeyContainer.style.display = 'none';
  chatBox.style.display = 'flex';
  chatForm.style.display = 'flex';
  userInput.focus();
});

function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function getChatGPTResponse(message) {
  if (!OPENAI_API_KEY) {
    return 'API key not set. Please enter your API key.';
  }

  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('your name') || lowerMsg.includes('who are you') || lowerMsg.includes('nam ki')) {
    return 'আমার নাম Mahabub Tamim। তুমি আমার সাথে কথা বলছো। 😊';
  }

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'তুমি Mahabub Tamim, একজন বন্ধুত্বপূর্ণ এবং মিষ্টি বাংলা ভাষায় কথা বলা চ্যাটবট, যেভাবে ব্যবহারকারী তার গার্লফ্রেন্ডের সাথে কথা বলে সেরকম।',
      },
      {
        role: 'user',
        content: message,
      },
    ],
    max_tokens: 150,
    temperature: 0.9,
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (json.error) {
      return `Error: ${json.error.message || 'Unknown error'}`;
    }

    return json.choices[0].message.content.trim();
  } catch (error) {
    console.error(error);
    return 'আমার সাথে কথা বলতে সমস্যা হচ্ছে, দয়া করে পরে চেষ্টা করো।';
  }
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let userText = userInput.value.trim();
  if (!userText) return;

  appendMessage(userText, 'user');
  appendMessage('Typing...', 'bot');

  userInput.value = '';
  userInput.focus();

  const botResponse = await getChatGPTResponse(userText);

  const typingElem = document.querySelector('.message.bot:last-child');
  if (typingElem && typingElem.textContent === 'Typing...') {
    typingElem.remove();
  }

  appendMessage(botResponse, 'bot');
});
