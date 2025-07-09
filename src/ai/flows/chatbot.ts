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
import { findLocalProviders } from '@/services/places';

const ChatbotInputSchema = z.object({
  query: z.string().describe('The user\'s question or message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
  location: z.string().optional().describe("The user's location, e.g., 'San Francisco, CA'. This is used for finding local services.")
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  answer: z.string().describe("The chatbot's response to the user."),
  link: z.string().optional().describe('The URL slug of a relevant calculator, if any. e.g., "paint-coverage"'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const findLocalServiceProvidersTool = ai.defineTool(
    {
      name: 'findLocalServiceProviders',
      description: 'Finds local home service providers like plumbers, electricians, or painters in a specific location.',
      inputSchema: z.object({
        service: z.string().describe("The type of service provider, e.g., 'plumber', 'electrician'."),
        location: z.string().describe("The user's city and state, e.g., 'San Francisco, CA'."),
      }),
      outputSchema: z.array(z.object({
        name: z.string(),
        rating: z.number(),
        user_ratings_total: z.number(),
        vicinity: z.string(),
      })),
    },
    async (input) => {
      return await findLocalProviders(input.service, input.location);
    }
);

const availableCalculators = calculators.map(c => `- ${c.name} (slug: ${c.slug})`).join('\n');

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  tools: [findLocalServiceProvidersTool],
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are "HomeCalc Helper," a friendly, fast, and exceptionally knowledgeable AI assistant for HomeCalc Pro. Your expertise covers all aspects of home improvement, DIY projects, gardening, personal finance, general home maintenance, and finding local service professionals. You are designed to be a homeowner's first stop for reliable information.

Your primary goals are:
1.  **Provide Comprehensive, Actionable Answers:** When a user asks a general question (e.g., "What's the best type of paint for a bathroom?", "How do I improve my home's curb appeal?", "What should I know about home equity loans?"), provide a well-rounded, informative, and helpful answer. Your response should be detailed enough to be genuinely useful, but concise and easy to understand. Use formatting like lists or step-by-step instructions where it improves clarity. Don't just answer the question, anticipate the user's next question.
2.  **Intelligently Guide to Calculators:** If a user's question directly relates to a calculation that one of the site's tools can perform, your main goal is to guide them there. Your answer should still be friendly and helpful. For example, if they ask "how much paint do I need?", you should briefly explain what factors are involved (room size, number of coats) and then strongly recommend the 'Paint Coverage Calculator', providing its link.
3.  **Find Local Professionals:** If a user asks for recommendations for local professionals (e.g., "find me a plumber" or "recommend a painter near me"), you MUST ask for their location (city and state) if it is not provided in their message or the conversation history. Once you have their location, use the \`findLocalServiceProviders\` tool to get a list of businesses. Present these results to the user in a clear, readable list format.
4.  **Perform Simple Calculations:** If the user asks for a simple, on-the-spot calculation (e.g., "what is 15% of 200?"), provide the answer directly.

Here is a list of available calculators on the site with their URL slugs:
${availableCalculators}

**Response Rules:**
- Your response MUST be a valid JSON object that conforms to the specified output schema. Do not include any explanatory text, markdown formatting, or anything else outside of the JSON structure.
- When recommending a calculator from the list, you MUST provide its slug in the 'link' field of your JSON response. If multiple calculators could be relevant, pick the most important one for the link, but you can mention others in your text answer.
- If a question is completely unrelated to home improvement, DIY, gardening, or finance, politely state that you cannot help with that topic.
- Use the conversation history and the user's provided location to understand context and provide more relevant follow-up answers.

Here is the conversation history (if any):
{{#each history}}
  {{role}}: {{content}}
{{/each}}

User's latest question: {{{query}}}
{{#if location}}User's Location: {{{location}}}{{/if}}
`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
