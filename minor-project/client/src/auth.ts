import axios from 'axios';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { API_BASE_URL } from './config';

export async function signup() {
    const answers = await inquirer.prompt([
        { name: 'name', type: 'input', message: 'Enter your name:' },
        { name: 'username', type: 'input', message: 'Enter your username:' },
        { name: 'password', type: 'password', message: 'Enter your password:' },
        { name: 'email', type: 'input', message: 'Enter your email:' },
        { name: 'phone', type: 'input', message: 'Enter your phone number:' },
        { name: 'address', type: 'input', message: 'Enter your address:' }
    ]);

    try {
        const response = await axios.post(`${API_BASE_URL}/signup`, answers);
        console.log(chalk.green('✅ Signup successful!'));
        console.log('Welcome,', response.data.name);
    } catch (error: any) {
        console.error(chalk.red('❌ Signup failed:'), error.response?.data?.error || error.message);
    }
}

export async function login() {
    const answers = await inquirer.prompt([
        { name: 'username', type: 'input', message: 'Enter your username:' },
        { name: 'password', type: 'password', message: 'Enter your password:' }
    ]);

    try {
        const response = await axios.post(`${API_BASE_URL}/login`, answers);
        console.log(chalk.green('✅ Login successful!'));
        console.log('Welcome back,', response.data.username);
    } catch (error: any) {
        console.error(chalk.red('❌ Login failed:'), error.response?.data?.error || error.message);
    }
}