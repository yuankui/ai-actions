import { OpenAI } from 'openai';
import type { AiActionConfig, AiApi } from './types.ts';

export const getAiApi = (config: AiActionConfig): AiApi => {
  const openai = new OpenAI({
    apiKey: config.ai.apiKey
  });

  return {
    async prompt(prompt: string): Promise<string> {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: prompt
          }
        ]
      });

      if (
        !response.choices ||
        response.choices.length === 0 ||
        !response.choices[0].message.content
      ) {
        throw new Error('No response from AI');
      }
      return response.choices[0].message.content;
    }
  };
};
