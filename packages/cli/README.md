# The Mastra CLI

![Mastra Cli](https://github.com/@mastra-ai/@mastra/blob/main/packages/cli/@mastra-cli.png)

Mastra is the Typescript framework for building AI agents and assistants. It’s used by some of the largest companies in the world to build internal AI automation tooling and customer-facing agents.

This is the CLI package, which allows you to:

- Create a new project
- Spin up the Mastra dev server
- Deploy to a Hono server, or a serverless environment like Cloudflare Workers or Vercel

## Installing the Mastra CLI

```bash copy
npm i -g @mastra
```

## Commands

### Init

`@actus-ag/@mastra/cli/cli init` is used for initializing a new project.

This creates a @mastra directory under `src` containing an `index.ts` entrypoint and an `agent` directory containing two sample agents.

```text
project-root/
├── src/
   ├── app/
   └── @mastra/
       ├── agents/
       │   └── agents.ts
       └── index.ts
```

### Dev

`@actus-ag/@mastra/cli/cli dev`

This spins up a local development server that hosts `REST` endpoints for all agents and workflows. It also has a chat interface for testing them.

The server is useful for testing and developing agents, workflows, and integrations without needing to deploy your application.

The server is available at `http://localhost:3000`.

### Build

`@actus-ag/@mastra/cli/cli build`

This command builds your Mastra project for deployment to different environments. The build process:

1. Reads your Mastra configuration
2. Generates optimized files for your target environment
3. Outputs them to a build directory

Options:

```bash
--dir     Directory containing Mastra files (default: src/@mastra)
```

Example usage:

```bash
# Build using default directory
@actus-ag/@mastra/cli/cli build

# Build from custom directory
@actus-ag/@mastra/cli/cli build --dir path/to/@mastra
```

The build output is determined by your Mastra instance's deployer configuration:

```typescript
const @mastra = new Mastra({
  deployer: {
    type: 'HONO', // Target environment (HONO, EXPRESS, NEXT)
    // Environment-specific options
  },
});
```

### Lint

`@actus-ag/@mastra/cli/cli lint`

Validates your Mastra project structure and code.

Options:

```bash
--root    Path to your root folder
--tools   Comma-separated list of paths to tool files to include
```

Example usage:

```bash
# Lint default directory
@actus-ag/@mastra/cli/cli lint
```

# Telemetry

This CLI collects anonymous usage data (no personal/sensitive info) to help improve Mastra. This includes:

- Commands used
- Command execution time
- Error occurrences
- System information (OS, Node version)

To opt-out:

1. Add `MASTRA_TELEMETRY_DISABLED=1` to commands

## Local development

1. clone the repo
2. Run `pnpm i` to install deps
