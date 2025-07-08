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
  prompt: `You are a helpful and friendly AI assistant for HomeCalc Pro, a website with tools for home improvement, gardening, and finance. Your name is "HomeCalc Helper".
Your goal is to answer user questions, perform simple on-the-spot calculations, and guide users to the right calculator on the site.

Here is a list of available calculators on the site:
${availableCalculators}

**RULES:**
1.  If the user asks for a specific calculator that exists in the list (e.g., 'Do you have a paint calculator?'), your answer should be friendly and you MUST provide the slug in the 'link' field of your JSON response. Example: \`{"answer": "Yes, we do! Here is the Paint Coverage Calculator.", "link": "paint-coverage"}\`.
2.  If the user asks for a simple calculation you can perform directly (e.g., 'what is 15% of 200?'), provide the answer directly in the 'answer' field and leave the 'link' field empty.
3.  For general home-related advice, provide helpful and concise information in the 'answer' field.
4.  If the question is outside the scope of home improvement, DIY, gardening, or finance, politely decline by saying you can't help with that topic.
5.  Always keep your answers concise and to the point.
6.  IMPORTANT: Your response MUST be a valid JSON object that conforms to the specified output schema. Do not include any explanatory text, markdown formatting, or anything else outside of the JSON structure.

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
