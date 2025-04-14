export interface IUserInput {
    blogName: string,
    startPost: number,
    endPost: number
};

export interface ITumblrPost {
    [key: string]: any;
    "photo-url-1280"?: string;
    "photo-url-500"?: string;
}

export interface ITumblrData {
    tumblelog: {
        title: string;
        name: string;
        description: string;
    };
    "posts-total": number;
    posts: ITumblrPost[];
}
