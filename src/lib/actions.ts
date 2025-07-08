'use server';

import { aiAssistedCalculations, AiAssistedCalculationsInput } from '@/ai/flows/ai-assisted-calculations';
import { recommendCalculators } from '@/ai/flows/calculator-recommendations';
import { chatbot, ChatbotInput } from '@/ai/flows/chatbot';

function checkApiKey() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error(
      'The GOOGLE_API_KEY environment variable is not set. Please add it to your .env file to enable AI features. You can get a key from the Google AI Studio.'
    );
  }
}

export async function getAiRecommendations(pastActivity: string) {
  checkApiKey();
  try {
    const result = await recommendCalculators({ pastActivity });
    return result;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    if (error instanceof Error) {
        throw new Error(`AI recommendations failed: ${error.message}`);
    }
    throw new Error('Failed to get AI recommendations.');
  }
}

export async function getAiAssistance(input: AiAssistedCalculationsInput) {
  checkApiKey();
  try {
    const result = await aiAssistedCalculations(input);
    return result;
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    if (error instanceof Error) {
        throw new Error(`AI assistance failed: ${error.message}`);
    }
    throw new Error('Failed to get AI assistance.');
  }
}

export async function getChatbotResponse(input: ChatbotInput) {
  checkApiKey();
  try {
    const result = await chatbot(input);
    return result;
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    if (error instanceof Error) {
        throw new Error(`Chatbot request failed: ${error.message}`);
    }
    throw new Error('Failed to get chatbot response.');
  }
}
