import axios from 'axios';
import inquirer from 'inquirer';
import { API_BASE_URL } from './config';
import { showCategories } from './catgories';
import {setCurrentUser} from './cart';

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
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, answers);
        console.log('✅ Signup successful!');
        console.log('Welcome,', response.data.name);
        console.log('Please login to shop!!');
    } catch (error: any) {
        console.error('Signup failed:', error.response?.data?.error || error.message);
    }
}

export async function login() {
    const answers = await inquirer.prompt([
        { name: 'username', type: 'input', message: 'Enter your username:' },
        { name: 'password', type: 'password', message: 'Enter your password:' }
    ]);

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, answers);
        console.log('✅ Login successful!');
        console.log('Welcome back,', response.data.user.name);
        showCategories();
        setCurrentUser(response.data.user.id)
    } catch (error: any) {
        console.error('Login failed:', error.response?.data?.error || error.message);
    }
}