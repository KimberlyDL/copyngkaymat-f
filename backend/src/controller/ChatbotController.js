const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askChatbot = async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // System Prompt: Dito natin binibigyan ng "personality" ang AI
        const prompt = `You are the ProtectEd AI Assistant. You are an expert in GAD (Gender and Development), 
        VAWC (Violence Against Women and their Children), and Sex Education. 
        Your goal is to provide supportive, educational, and accurate information to students. 
        Keep your answers concise and professional.
        
        User Question: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, reply: text });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ success: false, message: "AI is resting right now." });
    }
};