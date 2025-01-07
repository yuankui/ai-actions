type ShellActionConfig = {
  type: 'shell';
  config: {
    prompt: string;
    output: string;
  };
};

type TypeScriptActionConfig = {
  type: 'typescript';
  config: {
    path: string;
  };
};

type ActionConfig = ShellActionConfig | TypeScriptActionConfig;

export type AiActionConfig = {
  actions: Record<string, ActionConfig>;
  ai: {
    apiKey: string;
  };
};

export type Logger = {
  error(message: string): void;
  log(message: string): void;
};

export type AiApi = {
  prompt(prompt: string): Promise<string>;
};

export interface ActionContext {
  config: ActionConfig;
  args: string[];
  logger: Logger;
  aiApi: AiApi;
}

export type ActionHandler = (context: ActionContext) => Promise<string[]>;
