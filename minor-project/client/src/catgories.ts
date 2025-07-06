import inquirer from "inquirer";
import { API_BASE_URL } from "./config";
import axios from "axios";
import { showProductsInCategory } from "./products";
import { viewCart } from "./cart";

export async function showCategories() {
    try {
        const categories = await axios.get(`${API_BASE_URL}/categories`);
        
        const answers = await inquirer.prompt([
            {
                type: "list",
                name: "selectedCategory",
                message: "Choose a Category:",
                choices: [
                    ...categories.data.data,
                    { name: "View Cart", value: "cart" },
                    { name: "Exit", value: "exit" }
                ]
            },
        ]);

        if (answers.selectedCategory === "exit") {
            return;
        }

        if (answers.selectedCategory === "cart") {
            await viewCart();
            return showCategories();
        }

        await showProductsInCategory(answers.selectedCategory);
    } catch (error: any) {
        console.error('Failed to fetch categories:', 
            error.response?.data?.error || error.message
        );
        await showCategories();
    }
}

export async function initializeShop() {
    await showCategories();
}