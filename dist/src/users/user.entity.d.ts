export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    resetToken?: string;
    isTokenUsed: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    generateId(): void;
}
