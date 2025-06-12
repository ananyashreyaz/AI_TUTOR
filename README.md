# 🧠 AI Tutor Agent System

This project is an intelligent multi-agent system powered by **Google's Gemini AI**, designed to help users ask academic questions and receive targeted responses from specialized agents. It supports dynamic routing of user queries to domain-specific agents for **Math**, **Physics**, and **Chemistry**.

Built with **React (Vite)** and **Tailwind CSS**, this frontend interface provides a chat-style experience and lets users interact with agents using their own Gemini API key.

---

## Project Structure & Description

### Tutor Agent (Router Agent)
- **Role:** Acts as the central controller.
- **Function:** Parses the user's query and routes it to the most suitable domain-specific agent.
- **Logic:** Uses semantic similarity to determine if the query is best handled by the Math, Physics, or Chemistry agent.

---

###  Math Agent
- **Specialization:** Handles mathematical queries.
- **Example:** Solving arithmetic, algebraic expressions, derivatives.
- **Tools Used:**
  -  *MathJS Tool*: Evaluates mathematical expressions.
  -  *Basic Calculator Tool*: For performing calculations.
  
---

###  Physics Agent
- **Specialization:** Responds to physics-related questions.
- **Example:** Newton's laws, force, motion, acceleration problems.
- **Tools Used:**
  -  *Physics Constants Tool*: Access to fundamental physical constants.
  -  *Law Resolver Tool*: Helps with application of Newton's and other physics laws.

---

###  Chemistry Agent
- **Specialization:** Deals with chemistry concepts.
- **Example:** Periodic table lookups, atomic structure, reactions.
- **Tools Used:**
  -  *Periodic Table Tool*: Lookup elements and atomic properties.
  -  *Reagent Info Tool*: Understand chemical reactions or compounds.

---

### Extra Agent and tools implemented 
- Chemistry agent
- **Tools:** Added one extra tool usage in each agent


##  Tech Stack

| Tech | Description |
|------|-------------|
|  React (Vite) | Fast frontend framework for building UIs |
|  Tailwind CSS | Utility-first CSS framework |
|  Gemini API | Used for LLM interaction with agents |
|  Multi-Agent Logic | Route and process user questions intelligently |

---

##  How to Run the Project

###  Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Vite](https://vitejs.dev/) (installed automatically via npm)
- The file containing the entire code : /src/App.jsx

---

###  Installation Steps

```bash
git clone https://github.com/your-username/ai-tutor-agent.git


cd ai-tutor-agent


npm install

 Add Gemini API Key
Launch the app.

Paste your Gemini API Key into the input field in the sidebar.

Start the App

npm run dev
Visit: http://localhost:5173
```

### Functionalities
- The agent's status changes as the prompt is given. 
- More scalable as api is inntegrated in the frontend 
- Based on the prompt the task is delegated to the respective agent 
- Relevant responses are provided 
- Tools are implemented correctly. 

### Known Limitation
 Tailwind CSS is not rendering correctly.

Despite correctly installing and configuring Tailwind CSS (via postcss.config.js, tailwind.config.js, and importing tailwind.css), the styles do not apply properly on the UI. This may be due to a misconfiguration in the build system, PostCSS plugin order, or missing file references.