'use server';

import { aiAssistedCalculations, AiAssistedCalculationsInput } from '@/ai/flows/ai-assisted-calculations';
import { recommendCalculators } from '@/ai/flows/calculator-recommendations';
import { chatbot, ChatbotInput } from '@/ai/flows/chatbot';

export async function getAiRecommendations(pastActivity: string) {
  try {
    const result = await recommendCalculators({ pastActivity });
    return result;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw new Error('Failed to get AI recommendations.');
  }
}

export async function getAiAssistance(input: AiAssistedCalculationsInput) {
    try {
        const result = await aiAssistedCalculations(input);
        return result;
    } catch(error) {
        console.error('Error getting AI assistance:', error);
        throw new Error('Failed to get AI assistance.');
    }
}

export async function getChatbotResponse(input: ChatbotInput) {
  try {
    const result = await chatbot(input);
    return result;
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    throw new Error('Failed to get chatbot response.');
  }
}
