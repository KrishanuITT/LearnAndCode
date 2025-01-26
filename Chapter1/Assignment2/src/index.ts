#! /usr/bin/env node
import { Command } from 'commander';
import { prompt } from 'prompts';
import countries from './countries.json';

const program = new Command();

const promptCountryCode = async (): Promise<string> => {
    const response = await prompt({
        type: 'text',
        name: 'code',
        message: 'Please enter a country code:'
    });
    return response.code;
};

const findCountryByCode = (code: string) => {
    return countries.find(country => country.code === code.toUpperCase());
};

const displayCountry = (country: { country: string }) => {
    console.log(country.country);
};

const handleNoCountryFound = () => {
    console.log('No country found with this code.');
};

program
    .action(async () => {
        console.log('Hello, Welcome to the Countries of the World CLI!');
        
        const countryCode = await promptCountryCode();
        const country = findCountryByCode(countryCode);

        if (country) {
            displayCountry(country);
        } else {
            handleNoCountryFound();
        }
    })
    .description('Displays the full country name using the country code.');

program.parse(process.argv);
