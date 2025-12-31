#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import { CLIInterface } from './cli/CLIInterface.js';

async function main() {
  try {
    const cli = new CLIInterface();
    await cli.start();
  } catch (error) {
    console.error('Fatal error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
