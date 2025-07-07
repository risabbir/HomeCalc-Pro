'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-assisted calculations.
 *
 * - aiAssistedCalculations - A function that provides AI assistance for completing calculations.
 * - AiAssistedCalculationsInput - The input type for the aiAssistedCalculations function.
 * - AiAssistedCalculationsOutput - The return type for the aiAssistedCalculations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistedCalculationsInputSchema = z.object({
  calculatorType: z.string().describe('The type of calculator being used (e.g., HVAC, Home Improvement).'),
  parameters: z.record(z.string(), z.union([z.string(), z.number()])).describe('A key-value pair of parameters provided by the user.'),
});
export type AiAssistedCalculationsInput = z.infer<typeof AiAssistedCalculationsInputSchema>;

const AiAssistedCalculationsOutputSchema = z.object({
  autoCalculatedValues: z.record(z.string(), z.union([z.string(), z.number()])).optional().describe('Values automatically calculated by the AI.'),
  hintsAndNextSteps: z.string().optional().describe('Hints and next steps suggested by the AI to complete the calculation.'),
});
export type AiAssistedCalculationsOutput = z.infer<typeof AiAssistedCalculationsOutputSchema>;

export async function aiAssistedCalculations(input: AiAssistedCalculationsInput): Promise<AiAssistedCalculationsOutput> {
  return aiAssistedCalculationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedCalculationsPrompt',
  input: {schema: AiAssistedCalculationsInputSchema},
  output: {schema: AiAssistedCalculationsOutputSchema},
  prompt: `You are an AI assistant helping users complete calculations for their home projects.

The user is using a calculator of type: {{{calculatorType}}}

The following parameters have been provided:
{{#each parameters}}
  {{@key}}: {{this}}
{{/each}}

Based on the available parameters, either automatically calculate any missing values or provide hints and next steps to the user to complete the calculation.

If enough parameters are available to calculate missing values, populate the autoCalculatedValues field with the calculated values. Otherwise, provide helpful hints and next steps in the hintsAndNextSteps field.
`,
});

const aiAssistedCalculationsFlow = ai.defineFlow(
  {
    name: 'aiAssistedCalculationsFlow',
    inputSchema: AiAssistedCalculationsInputSchema,
    outputSchema: AiAssistedCalculationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
