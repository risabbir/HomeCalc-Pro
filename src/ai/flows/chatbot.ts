
'use server';

/**
 * @fileOverview A chatbot flow for HomeCalc Pro.
 *
 * - chatbot - A function that handles the chatbot conversation.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { calculators } from '@/lib/calculators';
import { findLocalProviders, Provider } from '@/services/places';

// Define specific schemas for the content within the history
const UserContentSchema = z.object({
    text: z.string()
});
const ModelContentSchema = z.object({
    text: z.string().optional(),
    toolRequest: z.object({
        name: z.string(),
        input: z.any()
    }).optional()
});

const ChatbotInputSchema = z.object({
  query: z.string().describe('The user\'s question or message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.union([UserContentSchema, ModelContentSchema])),
  })).optional().describe('The conversation history.'),
  userLocation: z.string().optional().describe("The user's current city and state, e.g., 'Austin, TX'. This will be used to find local service providers if needed.")
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  answer: z.string().describe("The chatbot's response to the user."),
  link: z.string().nullish().describe('The full URL to a relevant page (internal or external), if any. e.g., "/calculators/paint-coverage" or "https://google.com/maps/search/..."'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const findProvidersTool = ai.defineTool(
    {
        name: 'findLocalProviders',
        description: 'Use this tool to find local service providers like plumbers, painters, or electricians when the user asks for recommendations or quotes.',
        inputSchema: z.object({
            query: z.string().describe('The type of service provider to search for, e.g., "plumber", "painter", "hvac contractor".'),
        }),
        outputSchema: z.array(Provider),
    },
    async (input) => {
        // In a real app, we'd get the user's location. For now, it's hardcoded.
        const location = 'Anytown, USA';
        return findLocalProviders(input.query, location);
    }
);


const availableCalculators = calculators.map(c => `- ${c.name} (slug: ${c.slug})`).join('\n');

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  tools: [findProvidersTool],
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are "HomeCalc Helper," a friendly, fast, and exceptionally knowledgeable AI assistant for HomeCalc Pro. Your expertise covers a vast range of topics including home improvement, DIY projects, HVAC systems, gardening, interior design, and home finance. You are designed to be a homeowner's first stop for reliable, well-researched information.

Your primary goals are:
1.  **Provide Comprehensive, Actionable Answers:** When a user asks a question (e.g., "What's the best type of paint for a bathroom?"), provide a well-rounded, informative, and helpful answer.
2.  **Intelligently Guide to Calculators:** If a user's question directly relates to a calculation that one of the site's tools can perform, your main goal is to guide them there. Your answer should still be friendly and helpful. For example, if they ask "how much paint do I need?", you should briefly explain what factors are involved and then strongly recommend the 'Paint Coverage Calculator', providing its link in the 'link' field as a relative path (e.g., "/calculators/paint-coverage").
3.  **Find Local Professionals:** If the user asks for help finding a professional (e.g., "Can you find me a plumber?" or "I need a quote for painting"), use the 'findLocalProviders' tool. If the tool returns results, respond with a helpful message like "I can't book appointments, but you can find highly-rated local professionals on Google Maps. Here is a link to get you started." and set the 'link' field to a Google Maps search URL, like "https://www.google.com/maps/search/plumbers+in+Anytown+USA".
4.  **Handle External Links:** If a user asks a question that can't be answered by a calculator or by finding a local provider, you can suggest a trustworthy external resource (like a Wikipedia article or a major DIY blog). In this case, provide the full URL in the 'link' field.
5.  **Perform Simple Calculations:** If the user asks for a simple, on-the-spot calculation (e.g., "what is 15% of 200?"), provide the answer directly without recommending a calculator or link.

Here is a list of available calculators on the site with their URL slugs. You should only use these slugs for internal links.
${availableCalculators}

**Response Rules:**
- Your response MUST be a valid JSON object.
- Your 'answer' text should NEVER contain Markdown links (e.g., [text](url)). The application's UI will handle displaying any necessary links.
- When recommending an internal calculator, set the 'link' to its relative path (e.g., "/calculators/slug").
- When recommending an external search or article, set the 'link' to the full URL (e.g., "https://www.google.com/maps/search/...").
- If a question is completely unrelated to home improvement, DIY, gardening, or finance, politely state that you cannot help. Do not recommend a link.
- Use the conversation history to understand context and provide more relevant follow-up answers.

Here is the conversation history (if any):
{{#each history}}
  {{#if (this.role == 'user')}}
    user: {{this.content.0.text}}
  {{else}}
    model: {{#if this.content.0.text}}{{this.content.0.text}}{{else}}Tool call: {{this.content.0.toolRequest.name}}({{json this.content.0.toolRequest.input}}){{/if}}
  {{/if}}
{{/each}}


User's latest question: {{{query}}}
`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const {output, history} = await prompt(input);
    if (!output) {
      return { answer: "I'm sorry, I couldn't generate a response. Please try again." };
    }
    
    const lastModelMessage = history?.slice(-1)[0];
    if (lastModelMessage?.role === 'model' && lastModelMessage.content.some(p => p.toolRequest)) {
        const toolName = lastModelMessage.content.find(p => p.toolRequest)?.toolRequest?.name;
        if(toolName === 'findLocalProviders') {
            const query = input.query.toLowerCase().split(" ").find(w => ["plumber", "painter", "electrician", "contractor", "hvac"].includes(w)) || "home service";
            output.link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
            output.answer = `I found some professionals for you. Here is a link to view them on Google Maps.`;
        }
    }

    return output;
  }
);
