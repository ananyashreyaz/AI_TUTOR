import React, { useState, useRef, useEffect } from 'react';



const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);

const UserIcon = () => <Icon path="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
const BotIcon = () => <Icon path="M19.5 12.5c0 .9-.22 1.75-.62 2.5h-1.61c.21-.71.33-1.46.33-2.25s-.12-1.54-.33-2.25h1.61c.4.75.62 1.6.62 2.5zM4.5 12.5c0-.79.12-1.54.33-2.25H3.22c-.4.75-.62 1.6-.62 2.5s.22 1.75.62 2.5h1.61c-.21-.71-.33-1.46-.33-2.25zM12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-3 8.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />;
const SendIcon = () => <Icon path="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" className="w-5 h-5" />;
const KeyIcon = () => <Icon path="M21 10h-8.35A5.99 5.99 0 0 0 3 12a6 6 0 0 0 6 6h2v4h4v-4h2a4 4 0 0 0 4-4V6c0-1.11-.89-2-2-2H9.65A5.99 5.99 0 0 0 12 3a6 6 0 0 0-5.64 4H3v2h3.35A5.99 5.99 0 0 0 12.65 14H17a2 2 0 0 1-2-2v-2h6zM12 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" className="w-5 h-5" />;

// --- Agent and Tool Definitions ---

/**
 * A simple calculator tool.
 * For security and simplicity, this uses a regex and basic parsing 
 * instead of `eval()`. It only handles one operation at a time.
 * @param {string} expression - e.g., "25 * 4"
 * @returns {number | string} The result or an error message.
 */
const calculatorTool = (expression) => {
    const sanitized = expression.trim();
    const match = sanitized.match(/^(\d+\.?\d*)\s*([\+\-\*\/])\s*(\d+\.?\d*)$/);

    if (!match) {
        return `[Error: Invalid expression for calculator: "${expression}"]`;
    }

    const [, num1, operator, num2] = match;
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    switch (operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : "[Error: Division by zero]";
        default: return `[Error: Unknown operator: "${operator}"]`;
    }
};

/**
 * A tool for looking up physical constants.
 * @param {string} constantName - The name of the constant to look up.
 * @returns {string} The constant's value and unit, or a not found message.
*/
const physicsConstantsTool = (constantName) => {
    const constants = {
        "speed of light": "299,792,458 m/s",
        "gravitational constant": "6.67430 × 10^-11 N(m/kg)^2",
        "planck constant": "6.62607015 × 10^-34 J·s",
        "electron mass": "9.10938356 × 10^-31 kg",
    };
    const lowerCaseName = constantName.toLowerCase().trim();
    return constants[lowerCaseName] || `[Error: Constant "${constantName}" not found.]`;
};

/**
 * A tool for looking up periodic table elements.
 * @param {string} query - The element's name or symbol.
 * @returns {string} Information about the element or a not found message.
 */
const periodicTableTool = (query) => {
    const elements = {
        "h": { name: "Hydrogen", atomicNumber: 1, symbol: "H", mass: "1.008 u" },
        "he": { name: "Helium", atomicNumber: 2, symbol: "He", mass: "4.002602 u" },
        "li": { name: "Lithium", atomicNumber: 3, symbol: "Li", mass: "6.94 u" },
        "c": { name: "Carbon", atomicNumber: 6, symbol: "C", mass: "12.011 u" },
        "o": { name: "Oxygen", atomicNumber: 8, symbol: "O", mass: "15.999 u" },
        "n": { name: "Nitrogen", atomicNumber: 7, symbol: "N", mass: "14.007 u" },
        "na": { name: "Sodium", atomicNumber: 11, symbol: "Na", mass: "22.98976928 u" },
        "cl": { name: "Chlorine", atomicNumber: 17, symbol: "Cl", mass: "35.453 u" },
        // Add more elements as needed
    };

    const lowerCaseQuery = query.toLowerCase().trim();
    const element = Object.values(elements).find(
        e => e.name.toLowerCase() === lowerCaseQuery || e.symbol.toLowerCase() === lowerCaseQuery
    );

    if (element) {
        return `${element.name} (Symbol: ${element.symbol}, Atomic Number: ${element.atomicNumber}, Atomic Mass: ${element.mass})`;
    } else {
        return `[Error: Element "${query}" not found in the periodic table.]`;
    }
};

/**
 * A tool for looking up Newton's Laws of Motion.
 
 * @returns {string} The description of the law or a not found message.
 */
const newtonsLawTool = (lawNumber) => {
    const laws = {
        "1": "Newton's First Law of Motion (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
        "2": "Newton's Second Law of Motion: The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force, in the same direction as the net force, and inversely proportional to the mass of the object (F = ma).",
        "3": "Newton's Third Law of Motion: For every action, there is an equal and opposite reaction."
    };
    const trimmedLawNumber = lawNumber.trim();
    return laws[trimmedLawNumber] || `[Error: Newton's Law number "${lawNumber}" not found. Please specify 1, 2, or 3.]`;
};


/**
 * The main application component that orchestrates the agent system.
 */
export default function App() {
    const [apiKey, setApiKey] = useState('');
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hello! I am your AI Tutor. Ask me anything about Math, Physics, or Chemistry.", agent: 'Tutor' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [agentStatus, setAgentStatus] = useState('Idle');
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Gemini API Call ---
    const callGeminiAPI = async (prompt) => {
        if (!apiKey) {
            throw new Error('API key is not set.');
        }
        // Use a proxy if available to avoid CORS issues in development
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini API Error:", errorData);
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw error;
        }
    };

    // --- Agent Logic ---

    /**
     * Physics Agent: Answers physics questions and can use physics constants and Newton's Laws tools.
     */
    const PhysicsAgent = async (query) => {
        setAgentStatus('Physics Agent: Analyzing query...');
        const prompt = `You are an expert Physics tutor. Your name is PhysicsBot. A student asks: "${query}".
        First, determine if a specific tool lookup is required to answer the question.
        - If a physics constant lookup is needed (e.g., 'What is the speed of light?', 'value of planck constant'), respond ONLY with the special command: [LOOKUP_CONSTANT: constant_name]. For example: [LOOKUP_CONSTANT: speed of light].
        - If a Newton's Law lookup is needed (e.g., 'What is Newton's first law?', 'Explain the second law of motion'), respond ONLY with the special command: [NEWTONS_LAW: law_number]. For example: [NEWTONS_LAW: 1].
        - If the question is conceptual (e.g., 'Explain gravity', 'What is quantum mechanics?'), provide a clear explanation without using any special commands.`;

        try {
            let response = await callGeminiAPI(prompt);

            // Check if the agent wants to use the physics constants tool
            if (response.startsWith('[LOOKUP_CONSTANT:')) {
                setAgentStatus('Physics Agent: Using Physics Constants Tool...');
                const constantName = response.substring(17, response.length - 1).trim();
                const result = physicsConstantsTool(constantName);

                // Now, ask the model to format the result nicely
                setAgentStatus('Physics Agent: Explaining constant...');
                const finalPrompt = `The lookup result for "${constantName}" is "${result}". Explain this result to the student in the context of their original question: "${query}".`;
                response = await callGeminiAPI(finalPrompt);
            }
            // Check if the agent wants to use the Newton's Law tool
            else if (response.startsWith('[NEWTONS_LAW:')) {
                setAgentStatus('Physics Agent: Using Newton\'s Law Tool...');
                const lawNumber = response.substring(14, response.length - 1).trim();
                const result = newtonsLawTool(lawNumber);

                // Now, ask the model to format the result nicely
                setAgentStatus('Physics Agent: Explaining Newton\'s Law...');
                const finalPrompt = `The lookup result for Newton's Law number ${lawNumber} is "${result}". Explain this law to the student in the context of their original question: "${query}".`;
                response = await callGeminiAPI(finalPrompt);
            }
            return { text: response, agent: 'Physics' };

        } catch (error) {
            return { text: `Physics Agent Error: ${error.message}`, agent: 'System' };
        }
    };

    /**
     * Math Agent: Answers math questions and can use a calculator tool.
     */
    const MathAgent = async (query) => {
        setAgentStatus('Math Agent: Analyzing query...');
        const prompt = `You are a helpful Math tutor. Your name is MathBot. A student asks: "${query}".
        First, determine if a specific arithmetic calculation is required to answer the question.
        - If a calculation is needed (e.g., 'What is 12 * 5?', 'solve 100/4'), respond ONLY with the special command: [CALCULATE: expression]. For example: [CALCULATE: 12 * 5] or [CALCULATE: 100 / 4].
        - If the question is conceptual (e.g., 'What is algebra?', 'Explain Pythagorean theorem'), provide a clear explanation without using the CALCULATE command.
        `;

        try {
            let response = await callGeminiAPI(prompt);

            // Check if the agent wants to use the calculator tool
            if (response.startsWith('[CALCULATE:')) {
                setAgentStatus('Math Agent: Using Calculator Tool...');
                const expression = response.substring(11, response.length - 1);
                const result = calculatorTool(expression);

                // Now, ask the model to format the result nicely
                setAgentStatus('Math Agent: Explaining calculation...');
                const finalPrompt = `The calculation result for "${expression}" is ${result}. Explain this result to the student.`;
                response = await callGeminiAPI(finalPrompt);
            }
            return { text: response, agent: 'Math' };

        } catch (error) {
            return { text: `Math Agent Error: ${error.message}`, agent: 'System' };
        }
    };

    /**
     * Chemistry Agent: Answers chemistry questions and can use a periodic table tool.
     */
    const ChemistryAgent = async (query) => {
        setAgentStatus('Chemistry Agent: Analyzing query...');
        const prompt = `You are an expert Chemistry tutor. Your name is ChemBot. A student asks: "${query}".
        First, determine if a specific periodic table lookup is required to answer the question.
        - If an element lookup is needed (e.g., 'What is the atomic number of Oxygen?', 'Tell me about Carbon', 'Symbol for Sodium'), respond ONLY with the special command: [LOOKUP_ELEMENT: element_name_or_symbol]. For example: [LOOKUP_ELEMENT: Oxygen] or [LOOKUP_ELEMENT: Na].
        - If the question is conceptual (e.g., 'What is a covalent bond?', 'Explain pH scale'), provide a clear explanation without using the LOOKUP_ELEMENT command.`;

        try {
            let response = await callGeminiAPI(prompt);

            // Check if the agent wants to use the periodic table tool
            if (response.startsWith('[LOOKUP_ELEMENT:')) {
                setAgentStatus('Chemistry Agent: Using Periodic Table Tool...');
                const elementName = response.substring(16, response.length - 1).trim();
                const result = periodicTableTool(elementName);

                // Now, ask the model to format the result nicely
                setAgentStatus('Chemistry Agent: Explaining element...');
                const finalPrompt = `The lookup result for "${elementName}" is "${result}". Explain this information to the student in the context of their original question: "${query}".`;
                response = await callGeminiAPI(finalPrompt);
            }
            return { text: response, agent: 'Chemistry' };

        } catch (error) {
            return { text: `Chemistry Agent Error: ${error.message}`, agent: 'System' };
        }
    };

    /**
     * Tutor Agent: The main agent that routes queries to sub-agents.
     */
    const TutorAgent = async (query) => {
        setIsThinking(true);
        setAgentStatus('Tutor Agent: Classifying query...');

        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', text: query }]);
        setInput('');

        try {
            const classificationPrompt = `You are a routing agent. Your job is to classify a student's query into one of four categories: "Math", "Physics", "Chemistry", or "General". Respond with ONLY one of these words. Query: "${query}"`;
            const subject = (await callGeminiAPI(classificationPrompt)).trim().toLowerCase();

            let response;
            if (subject.includes('math')) {
                response = await MathAgent(query);
            } else if (subject.includes('physics')) {
                response = await PhysicsAgent(query);
            } else if (subject.includes('chemistry')) {
                response = await ChemistryAgent(query);
            }
            else {
                setAgentStatus('Tutor Agent: Answering general query...');
                const generalPrompt = `You are a helpful general tutor. A student asks: "${query}". You can't answer Math, Physics, or Chemistry questions in detail, but you can have a general conversation. If you think the question is about Math, Physics, or Chemistry, politely suggest they ask a more specific question on that topic.`;
                const text = await callGeminiAPI(generalPrompt);
                response = { text, agent: 'Tutor' };
            }

            setMessages(prev => [...prev, response]);

        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: `An error occurred: ${error.message}`, agent: 'System' }])
        } finally {
            setIsThinking(false);
            setAgentStatus('Idle');
        }
    };

    const handleSend = () => {
        if (input.trim() && !isThinking) {
            TutorAgent(input.trim());
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 font-sans">
            <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 text-center">AI Tutor Agent System</h1>
                <p className="text-center text-sm text-gray-500 mt-1">A multi-agent system using Gemini</p>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Control Panel */}
                <aside className="w-64 bg-white p-4 border-r border-gray-200 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Controls</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="apiKey" className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <KeyIcon /> Gemini API Key
                            </label>
                            <input
                                id="apiKey"
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your key here"
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                            <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline mt-1 block">Get a free key from Google AI Studio</a>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Agent Status</h3>
                            <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
                                <p className="font-semibold">{agentStatus}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Agent Descriptions</h3>
                            <ul className="text-xs text-gray-500 space-y-3 p-2 bg-gray-50 rounded-md">
                                <li><strong>Tutor Agent:</strong> Routes your questions.</li>
                                <li><strong>Math Agent:</strong> Solves math problems. Uses a calculator tool for arithmetic.</li>
                                <li><strong>Physics Agent:</strong> Answers physics questions. Uses tools for physical constants and Newton's Laws.</li>
                                <li><strong>Chemistry Agent:</strong> Answers chemistry questions. Uses a periodic table tool for element lookups.</li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Chat Area */}
                <main className="flex-1 flex flex-col p-4 bg-gray-50">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role !== 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                                        <BotIcon />
                                    </div>
                                )}
                                <div className={`max-w-lg p-3 rounded-xl ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white shadow-sm border border-gray-200'}`}>
                                    {msg.agent && msg.role !== 'user' && (
                                        <p className={`text-xs font-bold mb-1 ${
                                            msg.agent === 'Math' ? 'text-purple-600' :
                                            msg.agent === 'Physics' ? 'text-blue-600' :
                                            msg.agent === 'Chemistry' ? 'text-green-600' : 
                                            msg.agent === 'System' ? 'text-red-600' : 'text-indigo-600'
                                        }`}>
                                            {msg.agent} Agent
                                        </p>
                                    )}
                                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                        <UserIcon />
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={isThinking ? "Thinking..." : "Ask a math, physics, or chemistry question..."}
                                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                disabled={isThinking}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isThinking || !input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}