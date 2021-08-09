export interface User {
    id: number;
    username: string;
}

export interface LilipadInfo {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Lilipad extends LilipadInfo {
    text: string;
}
