"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const router = express_1.default.Router();
const chatHandler = async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            res.status(400).json({ error: 'Message is required and must be a string' });
            return;
        }
        if (!process.env.OPENROUTER_API_KEY) {
            console.error('OPENROUTER_API_KEY not found in environment variables');
            res.status(500).json({ error: 'Server configuration error' });
            return;
        }
        const response = await (0, node_fetch_1.default)('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3000',
                'Content-Type': 'application/json',
                'X-Title': 'Chat App'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { role: 'user', content: message }
                ]
            })
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(((_a = data.error) === null || _a === void 0 ? void 0 : _a.message) || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!((_d = (_c = (_b = data.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content)) {
            throw new Error('Invalid response format from AI service');
        }
        res.json({ response: data.choices[0].message.content });
    }
    catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Failed to get AI response',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
router.post('/chat', chatHandler);
exports.default = router;
