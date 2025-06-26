const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// তোমার ChatGPT API key এখানে রাখবে (তুমি দিছো, কিন্তু public না করা উচিত)
// **সিকিউরিটি কারনে ব্রাউজারে সরাসরি API key রাখা ঠিক নয়, তবে ডেমোর জন্য নিচে দেওয়া হলো। প্রকৃত প্রয়োজনে ব্যাকএন্ড ব্যবহার করো।**
const OPENAI_API_KEY = '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';

function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to tweak user input for GF style texting
function transformInput(text) {
  // এখানে তুমি চাইলে তোমার মতো casual, cute texting style add করতে পারো
  // যেমন: শেষেই "😊", "😘" যুক্ত করা, contractions ব্যবহার করা ইত্যাদি
  // সহজ উদাহরণ:
  if (!text.endsWith('😊')) {
    return text + ' 😊';
  }
  return text;
}

async function getChatGPTResponse(message) {
  // Check for specific questions (name) and reply immediately
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('your name') || lowerMsg.includes('who are you') || lowerMsg.includes('nam ki')) {
    return 'আমার নাম Mahabub Tamim। তুমি আমার সাথে কথা বলছো। 😊';
  }

  // Prepare API call to ChatGPT
  const prompt = `
তুমি Mahabub Tamim, একজন মিষ্টি, ভালোবাসাপূর্ণ চরিত্র, যেভাবে আমি আমার গার্লফ্রেন্ডের সাথে কথা বলি ঠিক সেরকম ভঙ্গিতে কথা বলো। 
User: ${message}
Tamim:`;

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `তুমি একজন বাংলা ভাষায় কথা বলা বন্ধুত্বপূর্ণ চ্যাটবট যার নাম Mahabub Tamim। তোমার ভঙ্গি মিষ্টি, প্রণয়পূর্ণ এবং casual, যেন তুমি আমার গার্লফ্রেন্ডের সাথে কথা বলছো।`
      },
      {
        role: 'user',
        content: message
      }
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
    // console.log(json);

    if (json.error) {
      return 'দুঃখিত, সার্ভারে কিছু সমস্যা হচ্ছে। পরে আবার চেষ্টা করো।';
    }

    const reply = json.choices[0].message.content.trim();
    return reply;

  } catch (error) {
    console.error(error);
    return 'আমার সাথে কথা বলতে সমস্যা হচ্ছে, দয়া করে পরে চেষ্টা করো।';
  }
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let userText = userInput.value.trim();
  if (!userText) return;

  // Show user's message
  appendMessage(userText, 'user');

  // Optionally transform input for casual texting style (comment this out if not needed)
  // userText = transformInput(userText);

  appendMessage('Typing...', 'bot');

  userInput.value = '';
  userInput.focus();

  // Get response from ChatGPT
  const botResponse = await getChatGPTResponse(userText);

  // Remove 'Typing...' message
  const typingElem = document.querySelector('.message.bot:last-child');
  if (typingElem && typingElem.textContent === 'Typing...') {
    typingElem.remove();
  }

  appendMessage(botResponse, 'bot');
});
