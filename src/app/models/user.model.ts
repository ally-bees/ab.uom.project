export interface User {
    id?: string;
    username: string;
    email: string;
    honeycombId: string;
    role: string;
}
  
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role:string;
    honeycombId: string;
}
  
export interface LoginRequest {
    email: string;
    password: string;
}
  
export interface AuthResponse {
    success: boolean;
    token: string;
    message: string;
    user: User;
}
