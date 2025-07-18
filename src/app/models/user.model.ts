export interface User {
    id?: string;
    username: string;
    email: string;
    HoneyCombId: string;
    Role: string;
    CompanyId?: string; 
}
  
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    honeycombId: string;
}
  
export interface LoginRequest {
    email: string;
    password: string;
}
  
export interface OtpVerifyRequest {
    email: string;
    otpCode: string;
    purpose: string;
}

export interface OtpRequest {
    email: string;
    purpose: string;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    message: string;
    user?: User;
    requiresOtpVerification?: boolean;
}
