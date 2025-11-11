#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig } from '../config/config.js';
import * as CONSTANTS from '../config/constants.js';

const program = new Command();

program
  .name(CONSTANTS.APP_NAME)
  .description(CONSTANTS.APP_DESCRIPTION)
  .version(CONSTANTS.APP_VERSION);

program
  .command('generate')
  .description('Generate a lesson plan for UE5.6')
  .option('-t, --theme <theme>', 'Lesson theme (e.g., "Control Rig Animation")')
  .option('-o, --output <path>', 'Output directory for generated HTML', './output')
  .action(async (options) => {
    const spinner = ora('Initializing BlueprintEmulator...').start();

    try {
      // Load configuration
      spinner.text = 'Loading configuration...';
      const config = getConfig();

      spinner.succeed('Configuration loaded successfully');

      // Check if theme is provided
      if (!options.theme) {
        spinner.fail('No theme provided');
        console.log(chalk.yellow('\nPlease provide a theme using -t or --theme option'));
        console.log(chalk.cyan('\nExample:'));
        console.log(chalk.gray('  npm run generate -- -t "Control Rig Animation"'));
        console.log(chalk.gray('  npm run generate -- -t "Special Move Effects"'));
        process.exit(1);
      }

      // Display current status
      console.log(chalk.green('\n✓ BlueprintEmulator is ready!'));
      console.log(chalk.cyan('\nConfiguration:'));
      console.log(chalk.gray(`  UE Version: ${CONSTANTS.TARGET_UE_VERSION}`));
      console.log(chalk.gray(`  Theme: ${options.theme}`));
      console.log(chalk.gray(`  Output: ${options.output}`));

      // Check API keys
      console.log(chalk.cyan('\nAPI Status:'));
      if (config.openaiApiKey) {
        console.log(chalk.green('  ✓ OpenAI API Key configured'));
      } else {
        console.log(chalk.yellow('  ⚠ OpenAI API Key not configured'));
      }

      if (config.anthropicApiKey) {
        console.log(chalk.green('  ✓ Anthropic API Key configured'));
      } else {
        console.log(chalk.yellow('  ⚠ Anthropic API Key not configured (optional)'));
      }

      // TODO: Implement actual lesson plan generation
      console.log(chalk.yellow('\n⚠ Lesson plan generation is not yet implemented'));
      console.log(chalk.gray('  This feature is currently under development (Week 3-4)'));
      console.log(chalk.gray('  Current progress: Data layer completed, service layer in progress'));

    } catch (error) {
      spinner.fail('Failed to initialize');
      if (error instanceof Error) {
        console.error(chalk.red(`\nError: ${error.message}`));
      } else {
        console.error(chalk.red('\nAn unknown error occurred'));
      }
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Display system information and configuration')
  .action(() => {
    console.log(chalk.cyan.bold(`\n${CONSTANTS.APP_NAME} v${CONSTANTS.APP_VERSION}`));
    console.log(chalk.gray(CONSTANTS.APP_DESCRIPTION));

    console.log(chalk.cyan('\nTarget UE Version:'));
    console.log(chalk.gray(`  ${CONSTANTS.TARGET_UE_VERSION}`));

    console.log(chalk.cyan('\nAvailable Themes:'));
    console.log(chalk.gray('  1. Control Rig Animation'));
    console.log(chalk.gray('  2. Special Move Effects'));

    console.log(chalk.cyan('\nConfiguration:'));
    try {
      const config = getConfig();
      console.log(chalk.gray(`  Debug Mode: ${config.debug ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.gray(`  OpenAI API: ${config.openaiApiKey ? 'Configured' : 'Not configured'}`));
      console.log(chalk.gray(`  Anthropic API: ${config.anthropicApiKey ? 'Configured' : 'Not configured'}`));
      console.log(chalk.gray(`  Timeout: ${config.maxGenerationTimeMs}ms`));
    } catch (error) {
      console.log(chalk.yellow('  ⚠ Configuration file not loaded'));
    }

    console.log(chalk.cyan('\nDevelopment Status:'));
    console.log(chalk.gray('  Phase: 1 (PoC)'));
    console.log(chalk.gray('  Progress: 15% (13/85 tasks completed)'));
    console.log(chalk.gray('  Current Week: Week 2 (Data layer - 67% complete)'));

    console.log(chalk.cyan('\nUsage:'));
    console.log(chalk.gray('  npm run dev -- generate -t "Control Rig Animation"'));
    console.log(chalk.gray('  npm run dev -- info'));
    console.log(chalk.gray('  npm run dev -- --help'));

    console.log();
  });

program.parse();
