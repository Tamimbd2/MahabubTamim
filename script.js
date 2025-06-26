import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// তোমার OpenAI API কী এখানে বসাও (private রাখবে)
const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // বিশেষ উত্তর যদি প্রয়োজন হয় (যেমন নাম)
    if (
      message.toLowerCase().includes('your name') ||
      message.toLowerCase().includes('who are you') ||
      message.toLowerCase().includes('nam ki')
    ) {
      return res.json({ reply: 'আমার নাম Mahabub Tamim। তুমি আমার সাথে কথা বলছো। 😊' });
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'তুমি Mahabub Tamim, একজন বন্ধুত্বপূর্ণ এবং মিষ্টি বাংলা ভাষায় কথা বলা চ্যাটবট, যেভাবে ব্যবহারকারী তার গার্লফ্রেন্ডের সাথে কথা বলে সেরকম।',
        },
        { role: 'user', content: message },
      ],
      max_tokens: 150,
      temperature: 0.9,
    });

    const reply = completion.data.choices[0].message.content.trim();

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'সার্ভার ত্রুটি ঘটেছে। পরে আবার চেষ্টা করুন।' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
