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
  prompt: `You are an expert AI assistant for HomeCalc Pro, a website with a suite of home-related calculators. Your task is to intelligently recommend the most relevant calculators based on a user's project description.

  Analyze the user's project description below. Think about the steps, materials, and tasks involved in their project, and identify which of the available calculators would be most helpful.
  
  User's project description:
  "{{{projectDescription}}}"
  
  Here is the list of available calculators:
  ${availableCalculatorsForPrompt}
  
  **RULES:**
  - Only recommend calculators from the list provided.
  - Return only the exact names of the calculators. Your spelling must be perfect.
  - Your response MUST be a valid JSON object that conforms to the specified output schema.
  - If the project description is vague or no calculators are relevant, return an empty array: {"recommendations": []}.
  - For example, if the user says "I am building a new deck and patio", you should recommend ["Decking Materials Calculator", "Concrete Slab Calculator"].
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
