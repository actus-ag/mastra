import { GithubIntegration } from "@actus-ag/mastra-github";
import { FirecrawlIntegration } from "@actus-ag/mastra-firecrawl";

export const github = new GithubIntegration({
  config: {
    PERSONAL_ACCESS_TOKEN: process.env.GITHUB_API_KEY!,
  },
})

export const firecrawl = new FirecrawlIntegration({
  config: {
    API_KEY: process.env.FIRECRAWL_API_KEY!,
  },
})
