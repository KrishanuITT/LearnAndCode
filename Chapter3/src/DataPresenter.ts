import { ITumblrData, ITumblrPost } from './Interfaces';

export class DataPresenter {
  display(data: ITumblrData | null): void {
    if (!data || !data.posts || data.posts.length === 0) {
      console.log("No blog posts found.");
      return;
    }

    const { tumblelog, posts } = data;

    console.log("\n-------------------------------------------------------");
    console.log(`Title: ${tumblelog.title || "N/A"}`);
    console.log(`Name: ${tumblelog.name}`);
    console.log(`Description: ${tumblelog.description}`);
    console.log(`No of Posts: ${data["posts-total"]}`);
    console.log("-------------------------------------------------------\n");

    posts.forEach((post: ITumblrPost, index: number) => {
      const imageUrl = post["photo-url-1280"] || post["photo-url-500"] || "No image available";
      console.log(`${index + 1}. ${imageUrl}`);
    });
  }
}
