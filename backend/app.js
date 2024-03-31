require("dotenv").config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");


const app = express();
const corsOptions = {
    origin: ['https://gemini-ai-mern-2.azurewebsites.net', 'http://localhost:5173', 'http://localhost:5174']
}
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions))
app.use(express.json());

app.post("/generate", async (req, res) => {
    const {prompt} = req.body;
    console.log({prompt})
    try {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // const prompt = "Write a story about a magic backpack."
        const result = await model.generateContent(prompt);

        const response = await result.response;
        const text = response.text();
        // console.log(text);
        res.send(text);
    } catch (error) {
        res.status(500).send("Failed to generate content")
    }
})

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();

    app.use(express.static(path.join(__dirname, 'frontend/dist')));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')));
} else {
    app.get('/', (req, res) => res.send('Server is ready' + "- NODE_ENV: " + process.env.NODE_ENV  ))
}

app.listen(PORT, console.log(`Server running at port: ${PORT}`))
