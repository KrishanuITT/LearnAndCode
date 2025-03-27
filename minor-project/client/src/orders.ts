import inquirer from "inquirer";
import axios from "axios";
import { showCategories } from "./catgories";
import { API_BASE_URL } from "./config";
import { viewCart } from "./cart";

let currentUserId: string | null = null;
let currentCartId: string | null = null;
let currentOrderId: string | null = null;
export async function viewOrders() {
    if (!currentUserId) {
        console.log("Please log in first");
        return;
    }

    try {
        const ordersResponse = await axios.get(`${API_BASE_URL}/orders/user/${currentUserId}`);
        const orders = ordersResponse.data.data;

        if (orders.length === 0) {
            console.log("\n--- No Orders Found ---");
            await viewCart();
            return;
        }

        console.log("\n--- Your Orders ---");
        orders.forEach((order: any, index: number) => {
            console.log(`${index + 1}. Order ID: ${order.id} - Total: $${order.total_amount.toFixed(2)} - Status: ${order.status}`);
        });

        const { selectedOrder } = await inquirer.prompt([
            {
                type: "list",
                name: "selectedOrder",
                message: "Select an order to view details:",
                choices: [
                    ...orders.map((order: any) => ({
                        name: `Order ${order.id} - $${order.total_amount.toFixed(2)}`,
                        value: order.id
                    })),
                    "Back to Cart"
                ]
            }
        ]);

        if (selectedOrder === "Back to Cart") {
            await viewCart();
        } else {
            await viewOrderDetails(selectedOrder);
        }
    } catch (error: any) {
        console.error("Failed to retrieve orders:", 
            error.response?.data?.error || error.message
        );
        await viewCart();
    }
}

export async function viewOrderDetails(orderId: string) {
    try {
        const orderResponse = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
        const orderItemsResponse = await axios.get(`${API_BASE_URL}/orders/${orderId}/items`);
        
        const order = orderResponse.data.data;
        const orderItems = orderItemsResponse.data.data;

        console.log("\n--- Order Details ---");
        console.log(`Order ID: ${order.id}`);
        console.log(`Status: ${order.status}`);
        console.log(`Total Amount: $${order.total_amount.toFixed(2)}`);
        console.log("\nItems:");

        const orderItemsWithDetails = await Promise.all(orderItems.map(async (item: any) => {
            const productResponse = await axios.get(`${API_BASE_URL}/products/${item.product_id}`);
            return {
                ...item,
                productName: productResponse.data.data.name
            };
        }));

        orderItemsWithDetails.forEach((item: any, index: number) => {
            console.log(`${index + 1}. ${item.productName} - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`);
        });

        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "Order Options:",
                choices: ["Back to Orders", "Back to Cart"]
            }
        ]);

        switch (action) {
            case "Back to Orders":
                await viewOrders();
                break;
            case "Back to Cart":
                await viewCart();
                break;
        }
    } catch (error: any) {
        console.error("Failed to retrieve order details:", 
            error.response?.data?.error || error.message
        );
        await viewOrders();
    }
}

export async function setCurrentUser(userId: string) {
    currentUserId = userId;
    currentCartId = null;
    currentOrderId = null;
}