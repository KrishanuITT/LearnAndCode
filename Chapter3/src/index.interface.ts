export interface UserInput {
    blogName: string,
    startPost: number,
    endPost: number
};

export interface TumblrPost {
    [key: string]: any;
    "photo-url-1280"?: string;
    "photo-url-500"?: string;
}

export interface TumblrData {
    tumblelog: {
        title: string;
        name: string;
        description: string;
    };
    "posts-total": number;
    posts: TumblrPost[];
}
