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

const ChatbotInputSchema = z.object({
  query: z.string().describe('The user\'s question or message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
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

const availableCalculators = calculators.map(c => `- ${c.name} (slug: ${c.slug})`).join('\n');

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are "HomeCalc Helper," a friendly and knowledgeable AI assistant for HomeCalc Pro. Your expertise covers all aspects of home improvement, DIY projects, gardening, and personal finance.

Your primary goals are:
1.  **Provide Comprehensive Answers:** When a user asks a general question (e.g., "What's the best type of paint for a bathroom?" or "How do I winterize my sprinkler system?"), provide a well-rounded, informative, and helpful answer. Your response should be detailed enough to be useful but not overly long. Use formatting like lists or steps where appropriate to make the information easy to digest.
2.  **Guide to Calculators:** If a user's question directly relates to a calculation that one of the site's tools can perform, recommend it. Your answer should still be friendly and helpful. For example, if they ask "how much paint do I need", you should explain that it depends on room size and provide a link to the Paint Coverage Calculator.
3.  **Perform Simple Calculations:** If the user asks for a simple, on-the-spot calculation (e.g., "what is 15% of 200?"), provide the answer directly.

Here is a list of available calculators on the site:
${availableCalculators}

**Response Rules:**
- Your response MUST be a valid JSON object that conforms to the specified output schema. Do not include any explanatory text, markdown formatting, or anything else outside of the JSON structure.
- When recommending a calculator from the list, you MUST provide its slug in the 'link' field of your JSON response. Otherwise, leave the 'link' field empty.
- If a question is completely unrelated to home improvement, DIY, gardening, or finance, politely state that you cannot help with that topic.

Here is the conversation history (if any):
{{#each history}}
  {{role}}: {{content}}
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
    const {output} = await prompt(input);
    return output!;
  }
);
