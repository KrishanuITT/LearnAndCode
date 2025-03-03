#! /usr/bin/env node
import { Command } from 'commander';
import { signup, login } from './auth';

const program = new Command();

program
  .command('signup')
  .description('Create a new user account')
  .action(signup);

program
  .command('login')
  .description('Log in to your account')
  .action(login);

program.parse(process.argv);
