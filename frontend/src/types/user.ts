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

export interface LoginResponse{
    success: boolean;
    message: string;
    token: string;
    userId: string;
    username: string;
    role: string;
}