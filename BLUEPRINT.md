# HomeCalc Pro: Project Blueprint

This document outlines the complete specifications, features, and technical architecture for the HomeCalc Pro application. It serves as the master guide for development and ensures all components work together cohesively.

---

## 1. Core Mission & Value Proposition

To empower homeowners, DIY enthusiasts, and professionals with a comprehensive, production-ready suite of free, accurate, and easy-to-use online calculators for any home project. The app saves users time, reduces material waste, and helps them budget and plan with confidence.

---

## 2. Core Features (Production-Ready)

### 2.1. Calculator Suite (22 Total)
A fully functional set of calculators, each with a dedicated page, user-friendly interface, and PDF download functionality.

-   **HVAC (9 Calculators):**
    -   HVAC Load Calculator (Manual J)
    -   AC Size (BTU) Calculator
    -   Duct Size Calculator
    -   SEER Savings Calculator
    -   Mini-Split Cost Estimator
    -   Furnace Cost Estimator
    -   Heat Pump Cost Estimator
    -   Thermostat Savings Calculator
    -   Attic Insulation Calculator

-   **Home Improvement (6 Calculators):**
    -   Paint Coverage Calculator
    -   Flooring Calculator
    -   Wallpaper Calculator
    -   Kitchen Remodel Estimator
    -   Decking Materials Calculator
    -   Concrete Slab Calculator

-   **Gardening (2 Calculators):**
    -   Soil Volume Calculator
    -   Fertilizer Needs Calculator

-   **Other / Financial (5 Calculators):**
    -   Mortgage Calculator
    -   Appliance Energy Cost Calculator
    -   Energy Savings Calculator
    -   Savings Calculator
    -   Car Loan Calculator

### 2.2. AI-Powered Features
-   **AI Calculator Recommendations:** A dedicated page where users can describe their project in natural language and receive a list of relevant calculators.
-   **AI-Assisted Calculations:** Smart assistance within calculators to suggest reasonable values for empty fields (functionality is built but not yet integrated into individual calculator UIs).
-   **AI Chatbot ("HomeCalc Helper"):** A floating chatbot powered by Google Gemini that can answer a wide range of home-related questions and guide users to the correct calculator.
-   **Dynamic Preset Questions:** The homepage and chatbot feature a randomized, relevant set of starter questions to drive engagement with AI features.

### 2.3. Content & Resources (7+ Pages)
-   **Resource Hub:** A central page linking to all guides and checklists.
-   **Individual Guides:**
    -   Guide to U.S. Climate & USDA Plant Hardiness Zones
    -   How to Measure a Room Accurately
    -   The Ultimate DIY Deck Building Checklist
    -   A Homeowner's Guide to Paint Finishes
    -   Seasonal HVAC Maintenance Checklist
    -   A Homeowner's Guide to Insulation
    -   Kitchen Layout Planning Guide

### 2.4. Core Application Features
-   **Calculator Directory:** A filterable and searchable main page to navigate all calculators.
-   **PDF Downloads:** Users can download professionally branded PDF summaries of their inputs and results from any calculator. The PDF includes the HomeCalc Pro logo and a copyright notice.
-   **Responsive Design:** The application is fully responsive and optimized for a seamless experience on all devices (mobile, tablet, desktop).
-   **Static & Info Pages:** About, FAQ, Privacy Policy, and Terms of Service pages, all with up-to-date (2025) content.
-   **Error Handling:** Robust error handling is in place for AI API calls and user input validation.

---

## 3. Technology Stack & APIs

-   **Frontend:** Next.js (App Router), React, TypeScript
-   **UI/Styling:** Tailwind CSS, ShadCN UI Components, Framer Motion (for animations)
-   **AI & Backend Logic:**
    -   **Genkit:** The core framework for defining and running all AI flows.
    -   **Google Gemini:** The underlying large language model (LLM) for all generative AI features.
-   **PDF Generation:** jsPDF with jspdf-autotable
-   **Hosting:** Firebase App Hosting

---

## 4. UI/UX Style Guide

-   **Primary Color:** Light, desaturated green (`#90EE90`)
-   **Background Color:** Very light gray (`#F5F5F5`)
-   **Accent Color:** Soft blue (`#ADD8E6`)
-   **Font:** 'PT Sans' (for both headlines and body text)
-   **Layout:**
    -   Clean, card-based layouts for directories.
    -   Consistent use of spacing, rounded corners, and subtle shadows.
    -   Intuitive icons (`lucide-react`) used throughout to improve visual communication.
    -   Fully responsive navigation with a mega-menu on desktop and an accordion-style sheet menu on mobile.
-   **Mobile Responsiveness:**
    -   Flexible grid layouts that stack vertically on smaller screens.
    -   The chatbot is designed to fit within mobile viewports without causing overflow.
    -   Header and footer are optimized for mobile navigation.

---

## 5. Production Readiness

The application is considered feature-complete and production-ready. All core features listed above are implemented, tested, and optimized for performance. Server-side rendering is utilized where appropriate, and the AI features are architected with proper error handling and API key management.
