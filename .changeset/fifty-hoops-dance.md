---
'@mastra/deployer': patch
---

Add the `@rollup/plugin-esm-shim` plugin to the bundler. If your code (or dependencies) uses things like `__dirname` you might see an error during `@actus-ag/@mastra/cli/cli dev` which is fixed now.
