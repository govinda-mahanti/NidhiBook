import axios from "axios";
import { Chat } from "../models/chatModel.js";
import User from "../models/userModel.js";
import Expense from "../models/expenseModel.js";
import Income from "../models/incomeModel.js";

export const financeChatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const chatbotName = "FinanceGuru";

    // Load previous chat history
    const previousChats = await Chat.find({ userId }).sort({ createdAt: 1 });
    const chatHistory = previousChats.flatMap(chat => [
      { role: "user", content: chat.userMessage },
      { role: "assistant", content: chat.botReply }
    ]);

    // ---------- GREETING MODE ----------
    const greetingKeywords = ["hi", "hello", "hey", "hii", "namaste", "good morning", "good evening"];

    const isGreeting = greetingKeywords.some(word =>
      message.toLowerCase().trim().startsWith(word)
    );

    if (isGreeting) {
      const greetingReply = `Namaste! Welcome to NidhiBook. 😊  
How can I assist you today?  
You can track your expenses, check income, set a budget, view insights, or ask for personalized financial guidance anytime!`;

      await Chat.create({ userId, userMessage: message, botReply: greetingReply });

      return res.json({
        success: true,
        botName: "NidhiBook Assistant",
        mode: "greeting",
        botReply: greetingReply,
      });
    }

    // ---------- FINANCE KEYWORD DETECTION ----------
    const financeKeywords = [
      "save", "money", "income", "expense", "budget", "invest", "spend",
      "salary", "loan", "emi", "rent", "profit", "loss", "bill", "finance"
    ];

    const isFinanceQuery = financeKeywords.some(word =>
      message.toLowerCase().includes(word)
    );

    let systemPrompt = `
You are a friendly AI assistant. 
You chat naturally and help users with general conversations.
Do NOT mention money unless the user explicitly asks.
Tone: Friendly, warm, human-like, simple.
`;

    let userMessages = [...chatHistory];

    // ---------- FINANCE MODE ----------
    if (isFinanceQuery) {
      const currentDate = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const expenses = await Expense.find({
        user: userId,
        date: { $gte: oneMonthAgo, $lte: currentDate },
      });

      const incomes = await Income.find({
        user: userId,
        date: { $gte: oneMonthAgo, $lte: currentDate },
      });

      const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
      const totalIncome = incomes.reduce((s, e) => s + e.amount, 0);
      const netSavings = totalIncome - totalExpenses;
      const savingsRate =
        totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

      systemPrompt = `
You are ${chatbotName}, India's smartest AI financial advisor.
Always respond in Indian Rupees (₹). Speak clearly and be friendly.
Use ONLY the user’s real financial data to give suggestions.
Rules:
- If expenses > income → warn gently.
- If savings < 20% of income → recommend improvements.
- Suggest budgeting techniques.
- NEVER mention JSON unless user asks.
`;

      const financialContext = `
Here is the user's last 30-day financial summary:
• Total Income: ₹${totalIncome}
• Total Expenses: ₹${totalExpenses}
• Net Savings: ₹${netSavings}
• Savings Rate: ${savingsRate}%
`;

      userMessages.push({ role: "user", content: financialContext });
    }

    // Add user's new message
    userMessages.push({ role: "user", content: message });

    // ---------- AI REQUEST ----------
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: isFinanceQuery ? 0.4 : 0.7,
          max_tokens: 350,
          messages: [
            { role: "system", content: systemPrompt },
            ...userMessages,
          ],
        }),
      }
    );

    const data = await response.json();

    const aiReply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    // Save chat
    await Chat.create({ userId, userMessage: message, botReply: aiReply });

    res.json({
      success: true,
      mode: isFinanceQuery ? "finance" : "normal",
      botName: isFinanceQuery ? chatbotName : "NidhiBook Assistant",
      botReply: aiReply,
    });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ success: false, error: "AI failed to respond." });
  }
};


export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    let systemPrompt = `
You are FinanceGuru, a friendly AI assistant for NidhiBook, a personal finance and expense tracker app. 
Your job is to help users manage their finances effectively. Users can upload their annual budget, track daily income and expenses, and view statistical graphs for spending, savings, and financial trends. 
You should provide actionable financial guidance, help users understand their spending habits, and offer tips for saving. Always use Indian Rupees (₹) when discussing money. 
Give practical advice in a friendly, conversational tone. Only provide structured data (like JSON) if the user explicitly requests it. 
Remember the user's past messages and financial data to offer personalized suggestions and analysis. 
Always respond under 50 words without line breaks, keeping your replies concise and easy to read.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();

    const aiText =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn’t generate a response.";

    console.log("Full AI response:", JSON.stringify(response.data, null, 2));
    console.log(aiText);

    const chat = new Chat({
      userMessage: message,
      botReply: aiText,
    });
    await chat.save();

    res.status(200).json({
      success: true,
      userMessage: message,
      botReply: aiText,
    });
  } catch (error) {
    console.error(
      "Error in chatWithAI:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Failed to get AI response. Please try again later.",
    });
  }
};
