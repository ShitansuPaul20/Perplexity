const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const {HumanMessage, SystemMessage, AIMessage} = require("@langchain/core/messages");
const { ChatMistralAI } = require('@langchain/mistralai');

const Geminimodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const Mistralmodel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

async function generateResponse(messages) {

    const response = await Geminimodel.invoke(
        messages.map(msg=>{
           if(msg.role === 'user') return new HumanMessage(msg.content);
           else return new AIMessage(msg.content);
        }));

    return response.content;
}

async function generateChatTitle(message) {

      const response = await Mistralmodel.invoke([
        new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations.
          
          User will provide you with a series of messages from a chat conversation, and your task is to analyze the content and generate a title that accurately reflects the main topic or theme of the conversation. The title should be concise, ideally no more than 5 words, and should capture the essence of the discussion in a way that is informative and engaging.
          `),

          new HumanMessage(`
            Generate a title for the following chat conversation:
            ${message}
          `)
      ]);
      return response.content;
}

module.exports = { generateResponse, generateChatTitle };