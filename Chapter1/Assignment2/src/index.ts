#! /usr/bin/env node
import { Command } from 'commander';
import { prompt } from 'prompts';
import countries from "./countries.json";

const program = new Command();

program
    .action(() => {
        console.log(`Hello, Welcome to the countries of world CLI!`);
        prompt({
            type: "text",
            name: "code",
            message: "Please enter a country code:"
        }).then((result: { code: string }) => {
            const country = countries.find(c => c.code === result.code.toUpperCase());
            if(country){
                console.log(`${country?.country}`);
                return;
            }
            console.log("No Country found with this code.");
        });
    })
    .description("Gives the full country name using country code.");

program.parse(process.argv);