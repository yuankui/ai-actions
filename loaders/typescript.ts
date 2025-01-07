import type { ActionContext, ActionHandler } from '../types';

export const TypeScriptLoader: ActionHandler = async (
  context: ActionContext
) => {
  const prompt = context.args.join(' ');
  const response = await context.aiApi.prompt(prompt);
  return response.trim();
};
