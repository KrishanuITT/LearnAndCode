import axios from "axios";
import { API_BASE_URL } from "./config";
import { showCategories } from "./catgories";
import inquirer from "inquirer";
import { addToCart } from "./cart";

export async function showProductsInCategory(categoryName: string) {
    try {
        const categoryData = await axios.get(`${API_BASE_URL}/categories/${categoryName}`);
        const productsResponse = await axios.get(`${API_BASE_URL}/products/category/${categoryData.data.data.category_id}`);

        console.log(`\n--- Products in ${categoryName} Category ---`);
        
        if (productsResponse.data.data.length === 0) {
            console.log("No products found in this category.");
            await showCategories();
            return;
        }

        const productChoices = [
            ...productsResponse.data.data.map((product: any) => ({
                name: `${product.name} - $${product.price}`,
                value: product
            })),
            { name: "Back to Categories", value: "back" }
        ];

        const productAnswer = await inquirer.prompt([
            {
                type: "list",
                name: "selectedProduct",
                message: "Select a product:",
                choices: productChoices
            }
        ]);

        if (productAnswer.selectedProduct === "back") {
            await showCategories();
            return;
        }
        await showProductDetails(productAnswer.selectedProduct);
    } catch (error: any) {
        console.error('Failed to fetch products:', 
            error.response?.data?.error || error.message
        );
        await showCategories();
    }
}

async function showProductDetails(product: any) {
    console.log("\n--- Product Details ---");
    console.log(`Name: ${product.name}`);
    console.log(`Price: $${product.price}`);
    console.log(`Description: ${product.description}`);
    console.log(`Stock: ${product.stock_quantity}`);

    const action = await inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose an action:",
            choices: [
                "Add to Cart",
                "Back to Products",
                "Back to Categories"
            ]
        }
    ]);

    switch (action.choice) {
        case "Add to Cart":
            await addToCart(product);
            break;
        case "Back to Products":
            await showProductsInCategory(product.category_name);
            break;
        case "Back to Categories":
            await showCategories();
            break;
    }
}