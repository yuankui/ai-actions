# AI Actions CLI

AI Actions CLI is a command-line tool that allows you to execute AI-driven actions using a configuration file. It supports different types of actions, such as shell commands and TypeScript scripts.

## Installation

To install the package globally, run:

```bash
npm install -g @yuankui/ai-actions
```

## Configuration

Create a configuration file at `~/.ai-actions/config.yaml` with the following structure:

```yaml
ai:
  apiKey: YOUR_OPENAI_API_KEY

actions:
  exampleAction:
    type: shell
    config:
      prompt: 'echo Hello, World!'
      output: 'text'
```

Replace `YOUR_OPENAI_API_KEY` with your actual OpenAI API key.

## Usage

To run the CLI, use the following command:

```bash
ai <action> [args...]
```

- `<action>`: The name of the action defined in your configuration file.
- `[args...]`: Optional arguments to pass to the action.

### Example

```bash
ai exampleAction
```

This will execute the `exampleAction` defined in your configuration file.

## Development

To contribute to the development of this CLI, clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/ai-actions-cli.git
cd ai-actions-cli
bun install
```

### Running Locally

You can run the CLI locally using:

```bash
bun run index.ts <action> [args...]
```

## License

This project is licensed under the MIT License.
