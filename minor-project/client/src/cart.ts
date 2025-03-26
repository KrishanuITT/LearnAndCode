import inquirer from "inquirer";
import axios from "axios";
import { showCategories } from "./catgories";
import { API_BASE_URL } from "./config";

let currentUserId: string | null = null;
let currentCartId: string | null = null;

export async function addToCart(product: any) {
    if (!currentUserId) {
        console.log("Please log in first");
        return;
    }

    if (!currentCartId) {
        const cartResponse = await axios.post(`${API_BASE_URL}/cart`, { 
            user_id: currentUserId 
        });
        currentCartId = cartResponse.data.data.cart_id;
    }

    const { quantity } = await inquirer.prompt([
        {
            type: "number",
            name: "quantity",
            message: `How many ${product.name} would you like to add? (Available: ${product.stock_quantity})`,
            validate: (input) => {
                const num = parseInt(input?.toString() || "");
                if (isNaN(num) || num <= 0) return "Please enter a valid quantity";
                if (num > product.stock_quantity) return "Insufficient stock";
                return true;
            },
            default: 1
        }
    ]);

    try {

        const addItemResponse = await axios.post(`${API_BASE_URL}/cart/items`, {
            cart_id: currentCartId || 2,
            product_id: product.id,
            quantity: quantity,
            price: product.price
        });

        console.log(`Added ${quantity} ${product.name}(s) to cart`);

        const continueAction = await inquirer.prompt([
            {
                type: "list",
                name: "next",
                message: "What would you like to do next?",
                choices: [
                    "Continue Shopping",
                    "View Cart",
                    "Checkout"
                ]
            }
        ]);

        switch (continueAction.next) {
            case "Continue Shopping":
                await showCategories();
                break;
            case "View Cart":
                await viewCart();
                break;
            case "Checkout":
                await checkout();
                break;
        }
    } catch (error: any) {
        console.error("Failed to add to cart:", 
            error.response?.data?.error || error.message
        );
        await showCategories();
    }
}

export async function viewCart() {
    if (!currentUserId) {
        console.log("Please log in first");
        return;
    }

    try {
        const cartResponse = await axios.get(`${API_BASE_URL}/cart/${currentUserId}`);
        currentCartId = cartResponse.data.data.id;
        console.log(`${API_BASE_URL}/cart/items/${currentCartId}`);
        const cartItemsResponse = await axios.get(`${API_BASE_URL}/cart/items/${currentCartId}`);
        const cartItems = cartItemsResponse.data.data;
    
        if (cartItems.length === 0) {
            console.log("\n--- Your Cart is Empty ---");
            const cartAction = await inquirer.prompt([
                {
                    type: "list",
                    name: "choice",
                    message: "Cart Options:",
                    choices: ["Continue Shopping"]
                }
            ]);
    
            switch (cartAction.choice) {
                case "Continue Shopping":
                    await showCategories();
                    break;
            }
        } else {
            const cartItemsWithDetails = await Promise.all(cartItems.map(async (item: any) => {
                const itemData = await axios.get(`${API_BASE_URL}/products/${item.product_id}`);
                return {
                    ...item,
                    productName: itemData.data.data.name
                };
            }));
    
            console.log("\n--- Your Cart ---");
            let total = 0;
            cartItemsWithDetails.forEach((item: any, index: number) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                console.log(`${index + 1}. ${item.productName} - Qty: ${item.quantity} - $${itemTotal.toFixed(2)}`);
            });
            console.log(`\nTotal: $${total.toFixed(2)}`);
    
            const cartAction = await inquirer.prompt([
                {
                    type: "list",
                    name: "choice",
                    message: "Cart Options:",
                    choices: [
                        "Continue Shopping",
                        "Update Item",
                        "Remove Item",
                        "Checkout",
                        "Clear Cart"
                    ]
                }
            ]);
    
            switch (cartAction.choice) {
                case "Continue Shopping":
                    await showCategories();
                    break;
                case "Update Item":
                    await updateCartItem();
                    break;
                case "Remove Item":
                    await removeCartItem();
                    break;
                case "Checkout":
                    await checkout();
                    break;
                case "Clear Cart":
                    await emptyCart();
                    break;
            }
        }
    } catch (error: any) {
        console.error("Failed to view cart:", 
            error.response?.data?.error || error.message
        );
        await showCategories();
    }
}

async function updateCartItem() {
    try {
        const cartItemsResponse = await axios.get(`${API_BASE_URL}/cart/items/${currentCartId}`);
        const cartItems = cartItemsResponse.data.data;

        const { selectedItem } = await inquirer.prompt([
            {
                type: "list",
                name: "selectedItem",
                message: "Select item to update:",
                choices: cartItems.map((item: any) => ({
                    name: `${item.name} - Current Qty: ${item.quantity}`,
                    value: item
                }))
            }
        ]);

        const { quantity } = await inquirer.prompt([
            {
                type: "number",
                name: "quantity",
                message: `Enter new quantity for ${selectedItem.name}:`,
                validate: (input) => {
                    const num = parseInt(input?.toString() || "");
                    if (isNaN(num) || num <= 0) return "Please enter a valid quantity";
                    return true;
                },
                default: selectedItem.quantity
            }
        ]);

        await axios.put(`${API_BASE_URL}/cart/items/${selectedItem.item_id}`, {
            quantity: quantity
        });

        console.log(`Updated ${selectedItem.name} quantity to ${quantity}`);
        await viewCart();
    } catch (error: any) {
        console.error("Failed to update cart item:", 
            error.response?.data?.error || error.message
        );
        await viewCart();
    }
}

async function removeCartItem() {
    try {
        const cartItemsResponse = await axios.get(`${API_BASE_URL}/cart/items/${currentCartId}`);
        const cartItems = cartItemsResponse.data.data;

        const { selectedItem } = await inquirer.prompt([
            {
                type: "list",
                name: "selectedItem",
                message: "Select item to remove:",
                choices: cartItems.map((item: any) => ({
                    name: `${item.name} - Qty: ${item.quantity}`,
                    value: item
                }))
            }
        ]);

        await axios.delete(`${API_BASE_URL}/cart/items/${selectedItem.item_id}`);

        console.log(`Removed ${selectedItem.name} from cart`);
        await viewCart();
    } catch (error: any) {
        console.error("Failed to remove cart item:", 
            error.response?.data?.error || error.message
        );
        await viewCart();
    }
}

async function emptyCart() {
    try {
        await axios.delete(`${API_BASE_URL}/cart/${currentUserId}`);
        console.log("Cart cleared");
        await showCategories();
    } catch (error: any) {
        console.error("Failed to clear cart:", 
            error.response?.data?.error || error.message
        );
        await showCategories();
    }
}

export async function checkout() {
    console.log("\n--- Checkout ---");
    
    try {
        const cartItemsResponse = await axios.get(`${API_BASE_URL}/cart/items/${currentCartId}`);
        const cartItems = cartItemsResponse.data.data;

        if (cartItems.length === 0) {
            console.log("Your cart is empty");
            await showCategories();
            return;
        }

        const confirmCheckout = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirm",
                message: "Confirm checkout?",
                default: true
            }
        ]);

        if (confirmCheckout.confirm) {
            console.log("Checkout successful!");
            await emptyCart();
        } else {
            await showCategories();
        }
    } catch (error: any) {
        console.error("Checkout failed:", 
            error.response?.data?.error || error.message
        );
        await showCategories();
    }
}

export async function setCurrentUser(userId: string) {
    currentUserId = userId;
    currentCartId = null;  
}