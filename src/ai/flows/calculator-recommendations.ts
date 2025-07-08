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
  pastActivity: z
    .string()
    .describe(
      'A description of the user past activity, including calculators used and any input provided to those calculators.'
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

const availableCalculators = calculators.map(c => c.name).join(', ');

const prompt = ai.definePrompt({
  name: 'recommendCalculatorsPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: RecommendCalculatorsInputSchema},
  output: {schema: RecommendCalculatorsOutputSchema},
  prompt: `You are a helpful assistant that recommends calculators to users based on their past activity.

  Given the following user activity:
  "{{{pastActivity}}}"

  The available calculators are: ${availableCalculators}

  Recommend a list of calculators that the user might find helpful. Only return the exact names of the calculators from the list provided.
  
  Your response MUST be a valid JSON object that conforms to the specified output schema.
  Do not include any explanatory text, markdown formatting, or anything else outside of the JSON structure.
  
  Specifically, you must return a JSON object with a single key "recommendations" which is an array of strings.
  For example: {"recommendations": ["Paint Coverage Calculator", "Flooring Calculator"]}
  If no calculators are relevant, return an empty array: {"recommendations": []}
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
