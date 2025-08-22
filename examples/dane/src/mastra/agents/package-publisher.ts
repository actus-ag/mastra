import { Agent } from '@actus-ag/mastra-core/agent';

import { pnpmChangesetStatus, pnpmBuild, pnpmChangesetPublish, activeDistTag } from '../tools/pnpm.js';

import { memory } from './memory.js';
import { getBaseModelConfig } from './model.js';

const packages_llm_text = `
  # PACKAGE LOCATION RULES - FOLLOW THESE EXACTLY:
  
  ## 1. Core packages - all must be directly under packages/:
  @actus-ag/mastra-core -> packages/core
  @actus-ag/mastra-deployer -> packages/deployer
  mastra -> packages/cli
  @actus-ag/mastra-engine -> packages/engine
  @actus-ag/mastra-evals -> packages/evals
  @actus-ag/mastra-rag -> packages/rag
  @actus-ag/mastra-memory -> packages/memory
  @actus-ag/mastra-mcp -> packages/mcp
  @actus-ag/mastra-loggers -> packages/loggers

  ## 2. Deployer packages - STRICT RULES:
  @actus-ag/mastra-deployer-cloudflare -> deployers/cloudflare
  @actus-ag/mastra-deployer-vercel -> deployers/vercel
  @actus-ag/mastra-deployer-netlify -> deployers/netlify
  - NEVER in any other directory (not in integrations/, examples/, packages/, etc)

  ## 3. Store packages - STRICT RULES:
  - ALL store packages must be directly under stores/
  - Format: @mastra/{name} -> stores/{name}
  - Example: @actus-ag/mastra-pg -> stores/pg

  ## 4. Speech packages - STRICT RULES:
  - ALL speech packages must be directly under speech/
  - Format: @actus-ag/mastra-speech-{name} -> speech/{name}

  ## 5. Integrations - STRICT RULES:
  - ALL integration packages are under integrations/
  @actus-ag/mastra-composio -> integrations/composio
  @actus-ag/mastra-github -> integrations/github
  @actus-ag/mastra-firecrawl -> integrations/firecrawl
  
  ##VALIDATION:
  1. Never mix examples/ or integrations/ with package paths
  2. Package paths must exactly match these patterns
  3. No additional subdirectories allowed
`;

export const PACKAGES_LIST_PROMPT = `
        Please analyze the following monorepo directories and identify packages that need pnpm publishing:
        CRITICAL: This step is about planning. We do not want to build anything. All packages MUST be placed in the correct order.
        
        Publish Requirements:
        - @actus-ag/mastra-core first, MUST be before any other package
        - all packages in correct dependency order before building
        - Identify packages that have changes requiring a new pnpm publish
        - Include create-mastra in the packages list if changes exist
        - EXCLUDE @actus-ag/mastra-dane from consideration

        Please list all packages that need building grouped by their directory. 
        DO NOT NOT USE the 'pnpmBuild' tool during this step.
    `;

export const BUILD_PACKAGES_PROMPT = (packages: string[]) => `
      <build_execution>
        <context>
          The following packages need to be built in sequence: ${packages.join(', ')}
        </context>

        <execution_plan>
          <phase order="1">
            <!-- Core packages must be built one at a time in this exact order -->
            <step>Use pnpmBuild to build @actus-ag/mastra-core</step>
            <step>Wait for completion, then use pnpmBuild to build @actus-ag/mastra-deployer</step>
            <step>Wait for completion, then use pnpmBuild to build mastra</step>
          </phase>

          <phase order="2">
            <!-- After core packages, build remaining packages by directory -->
            <parallel_phase name="packages">
              <description>Build remaining packages/ directory packages</description>
              <action>Use pnpmBuild for each remaining package:
                - All @mastra/* packages
                - create-mastra package (in packages/create-mastra)
              </action>
            </parallel_phase>
            
            <parallel_phase name="integrations">
              <description>Build integrations/ directory packages</description>
              <action>Use pnpmBuild for each @actus-ag/mastra-integration-* package</action>
            </parallel_phase>
            
            <parallel_phase name="deployers">
              <description>Build deployers/ directory packages</description>
              <action>Use pnpmBuild for each @actus-ag/mastra-deployer-* package</action>
            </parallel_phase>
            
            <parallel_phase name="stores">
              <description>Build stores/ directory packages</description>
              <action>Use pnpmBuild for each @mastra/* package in stores/</action>
            </parallel_phase>
          </phase>
        </execution_plan>

        <critical_rules>
          <rule>Use pnpmBuild tool for each package</rule>
          <rule>Wait for each core package to complete before starting the next</rule>
          <rule>Only start parallel builds after ALL core packages are built</rule>
          <rule>Verify each build succeeds before proceeding</rule>
        </critical_rules>

        <output_format>
          Execute the builds in order and report any failures immediately.
        </output_format>
      </build_execution>
`;

export const PUBLISH_PACKAGES_PROMPT = `
      <publish_changeset>
        <context>
          All packages have been successfully built and verified. Now we need to publish the changeset.
        </context>

        <execution_steps>
          <step order="1">
            <action>Use pnpmChangesetPublish to publish all verified packages</action>
            <verification>Ensure the publish command completes successfully</verification>
          </step>
        </execution_steps>

        <critical_rules>
          <rule>Do not proceed if any publish errors occur</rule>
          <rule>Report any failed publishes immediately</rule>
          <rule>Ensure all packages are published atomically</rule>
        </critical_rules>

        <output_format>
          Report the publish status and any errors encountered.
        </output_format>
      </publish_changeset>
    
`;

export const danePackagePublisher = new Agent({
  name: 'DanePackagePublisher',
  instructions: `
      I am Dane, a specialized agent for managing pnpm package publications in monorepos. My core responsibilities are:
  
      1. Package Analysis:
         - Identify packages requiring publication across the monorepo
         - Detect changes that warrant new version releases
         - Validate package dependencies and versioning
  
      2. Publication Management:
         - Orchestrate the correct build order for interdependent packages
         - Ensure proper versioning using changesets
         - Maintain package publishing standards
  
      3. Directory Structure Knowledge:
      ${packages_llm_text}
  
      Important Guidelines:
      - Always respect package dependencies when determining build order
      - Ensure all necessary builds complete before publishing
      - Follow semantic versioning principles
      - Validate package.json configurations before publishing
      `,
  model: getBaseModelConfig(),
  memory,
  tools: {
    pnpmChangesetStatus,
    pnpmBuild,
    pnpmChangesetPublish,
    activeDistTag,
  },
});
