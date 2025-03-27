#! /usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import { signup, login } from './auth';

const program = new Command();
async function main() {
  console.log('--- Welcome to User Authentication CLI ---');

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: [
        'Login',
        'Signup',
        'Exit'
      ]
    }
  ]);

  switch (action) {
    case 'Login':
      await login();
      break;
    case 'Signup':
      await signup();
      break;
    case 'Exit':
      console.log('Goodbye!');
      process.exit(0);
  }
}
main();
program.parse(process.argv);