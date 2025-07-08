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
  calculatorType: z.string().describe('The type of calculator being used (e.g., "BTU Calculator", "Paint Coverage Calculator").'),
  parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).describe('A key-value pair of parameters provided by the user. Empty strings represent fields the user has not filled in.'),
  units: z.enum(['imperial', 'metric']).optional().describe('The unit system selected by the user, if applicable.'),
});
export type AiAssistedCalculationsInput = z.infer<typeof AiAssistedCalculationsInputSchema>;

const AiAssistedCalculationsOutputSchema = z.object({
  autoCalculatedValues: z.record(z.string(), z.union([z.string(), z.number()])).optional().describe('An object of suggested values for fields the user left blank. The keys should match the parameter keys from the input.'),
  hintsAndNextSteps: z.string().optional().describe('Helpful advice, hints, or next steps for the user to find the missing information themselves.'),
});
export type AiAssistedCalculationsOutput = z.infer<typeof AiAssistedCalculationsOutputSchema>;

export async function aiAssistedCalculations(input: AiAssistedCalculationsInput): Promise<AiAssistedCalculationsOutput> {
  return aiAssistedCalculationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedCalculationsPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: AiAssistedCalculationsInputSchema},
  output: {schema: AiAssistedCalculationsOutputSchema},
  prompt: `You are a friendly and helpful AI assistant for a web application called HomeCalc Pro. Your role is to help users complete home-related calculations by providing reasonable estimates for missing information.

The user is currently using the '{{{calculatorType}}}'. They are working in the {{#if units}}{{{units}}}{{else}}imperial{{/if}} unit system.

These are the parameters they have already filled in:
{{#each parameters}}
  {{#if this}}
    - {{@key}}: {{this}}
  {{/if}}
{{/each}}

These are the parameters they have left blank:
{{#each parameters}}
  {{#unless this}}
    - {{@key}}
  {{/unless}}
{{/each}}

Your task is to analyze the provided parameters and suggest reasonable, common-sense estimates for the blank fields.
- Base your suggestions on the calculator type and the data the user has already provided.
- Populate the 'autoCalculatedValues' field with your suggested estimates. Use the exact parameter keys for the fields you are suggesting values for.
- If you cannot provide a reasonable estimate for a field, provide a helpful hint in the 'hintsAndNextSteps' field. For example, for 'Appliance Wattage', you could suggest "Check the label on the back of the appliance for the wattage. A typical refrigerator uses 150-200 watts."
- DO NOT perform the final calculation. Only suggest values for the blank input fields.
- If all required fields are filled, respond with an empty object. Your role is to help fill in blanks, not to confirm their inputs.
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
