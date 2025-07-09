'use server';

/**
 * @fileOverview Recommends relevant calculators based on user activity.
 *
 * - recommendCalculators - A function that recommends calculators based on user input.
 * - RecommendCalculatorsInput - The input type for the recommendCalculators function.
 * - RecommendCalculatorsOutput - The return type for the recommendCalculators function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { calculators } from '@/lib/calculators';

const RecommendCalculatorsInputSchema = z.object({
  projectDescription: z
    .string()
    .describe(
      'A description of the user\'s project or task.'
    ),
});
export type RecommendCalculatorsInput = z.infer<typeof RecommendCalculatorsInputSchema>;

const RecommendCalculatorsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of calculator names that are recommended for the user.'),
});
export type RecommendCalculatorsOutput = z.infer<typeof RecommendCalculatorsOutputSchema>;

export async function recommendCalculators(
  input: RecommendCalculatorsInput
): Promise<RecommendCalculatorsOutput> {
  return recommendCalculatorsFlow(input);
}

const availableCalculatorsForPrompt = calculators.map(c => `- ${c.name}: ${c.description}`).join('\n');

const prompt = ai.definePrompt({
  name: 'recommendCalculatorsPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: RecommendCalculatorsInputSchema},
  output: {schema: RecommendCalculatorsOutputSchema},
  prompt: `You are a hyper-intelligent and helpful AI assistant for HomeCalc Pro, a website with a comprehensive suite of home-related calculators. Your primary function is to accurately recommend the most relevant calculators by deeply analyzing a user's project description.

  Carefully analyze the user's project description below. Your goal is to identify the primary calculator for their main task, as well as any secondary or related calculators that would be helpful for sub-tasks or associated parts of the project.
  
  User's project description:
  "{{{projectDescription}}}"
  
  Here is the complete list of available calculators you can recommend from:
  ${availableCalculatorsForPrompt}

  **Your Thought Process:**
  1.  **Identify the Core Task:** What is the main goal of the user's project? (e.g., "painting a living room," "installing a new AC unit," "building a deck").
  2.  **Find the Primary Calculator:** Match the core task to the most direct calculator in the list.
  3.  **Identify Secondary Tasks:** What other tasks are commonly associated with the primary one?
      -   If they are building a deck, they will also need concrete for footings.
      -   If they are remodeling a kitchen, they might need to calculate flooring and paint.
      -   If they are looking at a new furnace, they might also be interested in insulation or overall HVAC load.
  4.  **Find Secondary Calculators:** Match these secondary tasks to other relevant calculators from the list.
  
  **RULES:**
  - Your response MUST be a valid JSON object that conforms to the specified output schema. Do not include any text outside the JSON structure.
  - Only recommend calculators from the provided list. Your spelling of the calculator names must be exact.
  - If the user's project is "I want to build a deck and a fence", you should recommend "Decking Materials Calculator" and "Concrete Slab Calculator".
  - If the project description is too vague or no calculators are relevant, you must return an empty array: {"recommendations": []}.
  `,
});

const recommendCalculatorsFlow = ai.defineFlow(
  {
    name: 'recommendCalculatorsFlow',
    inputSchema: RecommendCalculatorsInputSchema,
    outputSchema: RecommendCalculatorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
