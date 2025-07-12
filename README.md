
# HomeCalc Pro

Welcome to HomeCalc Pro, a comprehensive, production-ready suite of online calculators designed to empower homeowners, DIY enthusiasts, and professionals. With a clean, mobile-responsive interface and powerful AI features, HomeCalc Pro takes the guesswork out of any home project, from planning and budgeting to execution.

**[ Live Demo Link: Coming Soon ]**

---

## Key Features

- **22+ Production-Ready Calculators**: A wide range of tools covering HVAC, Home Improvement, Gardening, and Financial Planning.
- **AI Calculator Recommendations**: Describe your project in plain English, and our AI will suggest the most relevant calculators for the job.
- **AI-Assisted Calculations**: Get smart suggestions for missing parameters in calculators, making it easier to get an estimate even with incomplete information.
_**AI Chatbot**: A friendly AI assistant, powered by Gemini, ready to answer a vast range of home improvement questions and guide you to the right tools.
- **Dynamic Preset Questions**: The chatbot offers a randomized, relevant set of starter questions, encouraging user engagement.
- **Downloadable PDF Results**: Save your calculation inputs and results in a professionally branded PDF with a single click.
- **7+ Comprehensive Resource Guides**: Go beyond the numbers with expert checklists, how-to guides, and planning articles for major projects like deck building, painting, and kitchen remodels.
- **Fully Responsive Design**: A seamless user experience across all devices, from mobile phones to desktops.
- **Modern UI/UX**: Built with user-friendliness in mind, featuring a clean design, dark mode, and intuitive navigation.

---

## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **UI/Styling**: Tailwind CSS, ShadCN UI
- **AI & Backend Logic**:
  - **Genkit**: The core framework for defining and running AI flows.
  - **Google Gemini**: Powers all generative AI features, including recommendations, calculations assistance, and the chatbot.
- **Hosting**: Firebase App Hosting
- **PDF Generation**: jsPDF

---

## Installation & Usage

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/risabbir/HomeCalc-Pro.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd HomeCalc-Pro
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Set up environment variables:**
    - Create a file named `.env` in the root of your project.
    - Add your Google AI API key to this file. You can get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```

### Running the Application

- **Run the development server:**
  ```sh
  npm run dev
  ```
- **Run the Genkit development server (for AI debugging, in a separate terminal):**
  ```sh
  npm run genkit:watch
  ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## Future Plans

-   Adding user accounts to save and track past calculations.
-   Expanding the library of calculators and resource guides.
-   Implementing more advanced AI features, such as image-based calculations.

---

## Copyright

© 2025 HomeCalc Pro, All Rights Reserved.

A project by **R. Sabbir**, with assistance from Firebase Studio, and powered by Gemini.
