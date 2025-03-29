#!/usr/bin/env node
import prompts,{PromptObject} from 'prompts';
import { TumblrData, TumblrPost, UserInput } from './index.interface';

const TUMBLR_API_URL = "https://<blogName>.tumblr.com/api/read/json?type=photo&num=";

const getUserInput = async () => {
    const questions: PromptObject[] = [
        { type: "text", name: "blogName", message: "Enter the Tumblr blog name:" },
        { type: "text", name: "range", message: "Enter the post range (e.g., 1-5):" }
    ];

    const responses = await prompts(questions);
    const [startPost, endPost] = responses.range.split("-").map(Number);

    if (isNaN(startPost) || isNaN(endPost) || startPost <= 0 || endPost < startPost) {
        throw new Error("Invalid post range. Please enter a valid range (e.g., 1-5).\n");
    }

    return { blogName: responses.blogName, startPost, endPost };
};

const createURL = (userInput: UserInput): string => {
    const { blogName, startPost, endPost } = userInput;
    return TUMBLR_API_URL.replace("<blogName>", blogName) + 
           (endPost - startPost + 1) + `&start=${startPost - 1}`;
};

const fetchTumblrBlogs = async (apiUrl: string) => {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const rawResponse = await response.text(); // Response comes with some extra data, converting it to text
        const formattedResponse = rawResponse.replace("var tumblr_api_read = ", "").trim().slice(0, -1); // removing the extra data and whitespace other than json 
        return JSON.parse(formattedResponse);
    } catch (error) {
        console.error("Error fetching Tumblr data:", error);
        return null;
    }
};

const displayBlogs = (data:TumblrData) => {
    if (!data || !data.posts || data.posts.length === 0) {
        console.log("No blog posts found.");
        return;
    }

    console.log("\n-------------------------------------------------------");
    console.log(`Title: ${data.tumblelog.title || "N/A"}`); // If no title then show N/A
    console.log(`Name: ${data.tumblelog.name}`);
    console.log(`Description: ${data.tumblelog.description}`);
    console.log(`No of Posts: ${data["posts-total"]}`);
    console.log("-------------------------------------------------------\n");
    
    data.posts.forEach((post:TumblrPost, index:number) => {
        console.log(`${index + 1}. ${post["photo-url-1280"] || post["photo-url-500"] || "No image available"}`);
    });
};

const main = async () => {
    const userInput = await getUserInput();
    const blogsUrl = createURL(userInput);
    console.log(`Fetching blogs from: ${blogsUrl}`);
    
    const blogs = await fetchTumblrBlogs(blogsUrl);
    if (blogs?.posts) {
        displayBlogs(blogs);
    } else {
        console.log("No blog posts found.");        
    }
};

main();