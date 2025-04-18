import { Role } from "../enums/role.enums";

export interface LoginDto {
    email: string;
    password: string;
}
  
export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    role: Role;
}