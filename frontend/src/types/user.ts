export interface User{
    userId: string;
    email: string;
    username: string;
    role: string;
}

export interface RegisterResponse{
    success: boolean;
    message: string;
}