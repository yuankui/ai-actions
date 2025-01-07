#!/usr/bin/env node
import yaml from 'js-yaml';
import { exec } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { getAiApi } from './aiApi.ts';
import { createLogger } from './logger.ts';
import type { ActionHandler, AiActionConfig } from './types.ts';
import { ShellLoader } from './loaders/shell.ts';
import { TypeScriptLoader } from './loaders/typescript.ts';
import type { ExecException } from 'child_process';
import inquirer from 'inquirer';

const execPromise = promisify(exec);

function loadConfig(filePath: string): AiActionConfig {
  return yaml.load(readFileSync(filePath, 'utf8')) as AiActionConfig;
}

const actionHandlers: Record<string, ActionHandler> = {
  shell: ShellLoader,
  typescript: TypeScriptLoader
};

async function executeAction(
  config: AiActionConfig,
  action: string,
  args: string[]
) {
  const actionConfig = config.actions[action];
  const handler = actionHandlers[actionConfig.type];
  if (handler) {
    return await handler({
      config: actionConfig,
      args,
      logger: createLogger(),
      aiApi: getAiApi(config)
    });
  } else {
    console.error(`Unsupported action type: ${actionConfig.type}`);
  }
}

const main = async () => {
  const configPath = process.env.HOME
    ? `${process.env.HOME}/.ai-actions/`
    : '~/.ai-actions/';

  // Main execution
  const config: AiActionConfig = loadConfig(
    path.join(configPath, 'config.yaml')
  );
  const aiConfig = config.ai;
  process.env.OPENAI_API_KEY = aiConfig.apiKey;

  const [, , action, ...args] = process.argv;

  if (!action) {
    console.error('No action provided.');
    // list all actions available
    console.log(
      'Available actions:\n' +
        Object.keys(config.actions)
          .map((action) => `  - ${action}`)
          .join('\n')
    );
    return;
  }
  const commands = await executeAction(config, action, args);
  if (!commands || commands.length === 0) {
    console.error('No command to execute found.');
    return;
  }

  let command: string;
  // it there are multiple commands, ask user to select one or if there is only one command,
  // ask user to confirm before execute it
  if (commands.length > 1) {
    const { answer } = await inquirer.prompt([
      {
        type: 'list',
        name: 'answer',
        message: 'which command do you want to execute?',
        choices: commands,
        default: commands[0]
      }
    ]);
    command = answer;
  } else {
    console.log(`\nCommands to execute:\n\n${commands.join('\n')}\n`);
    const { answer } = await inquirer.prompt([
      {
        type: 'list',
        name: 'answer',
        message: 'Do you want to execute this command?',
        choices: ['yes', 'no'],
        default: 'yes'
      }
    ]);

    if (answer === 'yes') {
      command = commands[0];
    } else {
      console.log('Command execution cancelled.');
      process.exit(0);
    }
  }

  try {
    const { stdout, stderr } = await execPromise(command);
    console.error(stderr);
    console.log(stdout);
  } catch (error: unknown) {
    const e = error as ExecException;
    console.error(e.stderr);
    console.log(e.stdout);
    process.exit(e.code);
  }
};

main();
