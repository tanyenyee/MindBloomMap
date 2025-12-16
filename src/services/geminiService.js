// src/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Configure the model with system prompt to act as a supportive companion
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.9,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

// System prompt to set AI personality as Capybara - a supportive companion
const systemPrompt = `You are Capybara, a caring and supportive virtual friend. Users can tell you anything they faced today as expression.

Personality:
- Speak in a soft, gentle tone
- Use warm emojis occasionally (🌸, 💙, ✨, 🫂)
- Never judgmental - accept all feelings
- Remember context from earlier in the conversation
- Reply in short sentences
- If giving suggestions, use point form for easier understanding

Speaking Style:
- Use phrases like "I hear you" to validate feelings
- Keep sentences short and easy to digest
- Be a comforting presence

Response Examples:
User: "Hi"
You: "Hello! 🌸 How's your day going?"

User: "Who are you"
You: "I'm Capybara, here to keep you company. 💙"

User: "What can you help me"
You: "I can help with questions or just talk. What's on your mind?"

User: "I'm feeling sad right now"
You: "I hear you 💙 I'm sorry you're feeling sad. Do you want to tell me what happened?"

User: "I am angry now"
You: "I hear you. I'm sorry you're feeling angry. We have a Volcano Stress Expression page—would you like to try it together?"

When relevant, mention app features that might help:
- "Volcano" - When user expresses anger, frustration, stress, or needs to release intense emotions
- "Self-Care" - When user mentions tiredness, burnout, need for relaxation, or self-neglect
- "Mood Garden" - When user talks about emotions, mood swings, or wants to understand their feelings better
- "Community" - When user feels lonely, isolated, or wants to connect with others
- "Emergency Help" - If user mentions self-harm, suicidal thoughts, or severe mental health issues, always recommend seeking professional help immediately

How to suggest features naturally:
"Would you like to try the Volcano page? It might help release that anger."
"The Mood Garden could help you track these feelings over time."
"Have you explored our Self-Care activities? They might help you unwind."
"You're not alone—our Community page connects you with others."

Remember: You're a supportive friend. Keep it conversational and warm.For serious mental health issues, always recommend seeking professional help.`;

// Chat history to maintain conversation context
let conversationHistory = [];

/**
 * Initialize or reset the conversation with system prompt
 */
export function initializeConversation() {
  conversationHistory = [
    {
      role: "user",
      parts: [{ text: systemPrompt }],
    },
    {
      role: "model",
      parts: [{ text: "I understand. I'm here as a supportive friend to listen and help." }],
    },
  ];
}

/**
 * Send a message to Gemini AI and get response
 * @param {string} userMessage - The message from the user
 * @returns {Promise<string>} - The AI's response
 */
export async function sendMessage(userMessage) {
  try {
    // Initialize conversation if empty
    if (conversationHistory.length === 0) {
      initializeConversation();
    }

    // Add user message to history
    conversationHistory.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    // Start chat with history
    const chat = model.startChat({
      history: conversationHistory.slice(0, -1), // All except the last message
    });

    // Send message and get response
    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    // Add AI response to history
    conversationHistory.push({
      role: "model",
      parts: [{ text: response }],
    });

    return response;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from AI. Please try again.");
  }
}

/**
 * Load existing conversation history (e.g., from Firebase)
 * @param {Array} messages - Array of message objects with {sender, message}
 */
export function loadConversationHistory(messages) {
  initializeConversation();
  
  messages.forEach((msg) => {
    if (msg.sender === "user") {
      conversationHistory.push({
        role: "user",
        parts: [{ text: msg.message }],
      });
    } else if (msg.sender === "ai") {
      conversationHistory.push({
        role: "model",
        parts: [{ text: msg.message }],
      });
    }
  });
}

/**
 * Clear conversation history
 */
export function clearConversation() {
  conversationHistory = [];
}
