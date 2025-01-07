import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { ActionContext, ActionHandler } from '../types';
const execPromise = promisify(exec);

export const ShellLoader: ActionHandler = async (context: ActionContext) => {
  if (context.config.type !== 'shell') {
    throw new Error('Invalid action type');
  }
  const promptTemplate = context.config.config.prompt;
  const renderedPrompt = promptTemplate.replace(/\{{([^}]+)}}/g, (_, key) => {
    if (key === 'args') {
      return context.args.join(' ');
    }
    throw new Error(`Unknown template variable: ${key}`);
  });

  try {
    const { stdout, stderr } = await execPromise(renderedPrompt);
    if (stderr) {
      throw new Error(`Error executing shell command: ${stderr}`);
    } else {
      // execute ai api
      const prompt = `${stdout}\n output format: ${context.config.config.output}`;
      const response = await context.aiApi.prompt(prompt);

      try {
        return JSON.parse(response);
      } catch (error) {
        return [response];
      }
    }
  } catch (error: any) {
    throw new Error(`Error executing shell command: ${error.message}`);
  }
};
