const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

async function testAI(prompt) {
    model.invoke("What is AI explain under 100 words?")
    .then((response) => {
        console.log(response.content);
    }).catch((error) => {        
        console.error("Error:", error);
    });
}

module.exports = { testAI };