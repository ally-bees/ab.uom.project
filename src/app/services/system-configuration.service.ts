import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface SystemConfigSummary {
  securitySettings: SecuritySettings;
  generalSettings: SystemConfig[];
  apiKeys: ApiKey[];
  systemHealth: SystemHealth;
}

export interface SystemConfig {
  id?: string;
  configKey: string;
  configValue: string;
  description: string;
  dataType: string;
  category: string;
  isEncrypted: boolean;
  isEditable: boolean;
  validationRules?: string;
}

export interface SecuritySettings {
  id?: string;
  passwordPolicy: PasswordPolicy;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiryDays?: number;
}

export interface ApiKey {
  id?: string;
  keyName: string;
  keyValue: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  permissions: string[];
}

export interface CreateApiKey {
  keyName: string;
  permissions: string[];
  expiresAt?: Date;
}

export interface SystemHealth {
  databaseConnected: boolean;
  emailServiceConnected: boolean;
  activeUsers: number;
  lastBackup: Date;
  memoryUsagePercent: number;
  cpuUsagePercent: number;
}

export interface UpdateSystemConfig {
  configValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class SystemConfigurationService {
  private apiUrl = 'http://localhost:5241/api/systemconfiguration';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // General Configuration Methods
  getSystemConfigurationSummary(): Observable<any> {
    console.log('🔍 Fetching system configuration summary...');
    
    return this.http.get(`${this.apiUrl}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ System configuration summary retrieved:', response)),
      catchError(this.handleError)
    );
  }

  getConfigurationsByCategory(category: string): Observable<any> {
    console.log(`🔍 Fetching configurations for category: ${category}`);
    
    return this.http.get(`${this.apiUrl}/category/${category}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log(`✅ Configurations for ${category} retrieved:`, response)),
      catchError(this.handleError)
    );
  }

  getConfiguration(configKey: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${configKey}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateConfiguration(configKey: string, updateData: UpdateSystemConfig): Observable<any> {
    console.log(`🔍 Updating configuration: ${configKey}`, updateData);
    
    return this.http.put(`${this.apiUrl}/${configKey}`, updateData, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log(`✅ Configuration ${configKey} updated:`, response)),
      catchError(this.handleError)
    );
  }

  createConfiguration(configData: SystemConfig): Observable<any> {
    console.log('🔍 Creating new configuration:', configData);
    
    return this.http.post(`${this.apiUrl}`, configData, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ Configuration created:', response)),
      catchError(this.handleError)
    );
  }

  deleteConfiguration(configKey: string): Observable<any> {
    console.log(`🔍 Deleting configuration: ${configKey}`);
    
    return this.http.delete(`${this.apiUrl}/${configKey}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log(`✅ Configuration ${configKey} deleted:`, response)),
      catchError(this.handleError)
    );
  }

  // Security Settings Methods
  getSecuritySettings(): Observable<any> {
    console.log('🔍 Fetching security settings...');
    
    return this.http.get(`${this.apiUrl}/security`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ Security settings retrieved:', response)),
      catchError(this.handleError)
    );
  }

  updateSecuritySettings(securitySettings: SecuritySettings): Observable<any> {
    console.log('🔍 Updating security settings:', securitySettings);
    
    return this.http.put(`${this.apiUrl}/security`, securitySettings, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ Security settings updated:', response)),
      catchError(this.handleError)
    );
  }

  // API Key Management Methods
  getApiKeys(): Observable<any> {
    console.log('🔍 Fetching API keys...');
    
    return this.http.get(`${this.apiUrl}/apikeys`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ API keys retrieved:', response)),
      catchError(this.handleError)
    );
  }

  createApiKey(createData: CreateApiKey): Observable<any> {
    console.log('🔍 Creating new API key:', createData);
    
    return this.http.post(`${this.apiUrl}/apikeys`, createData, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ API key created:', response)),
      catchError(this.handleError)
    );
  }

  regenerateApiKey(keyId: string): Observable<any> {
    console.log(`🔍 Regenerating API key: ${keyId}`);
    
    return this.http.put(`${this.apiUrl}/apikeys/${keyId}/regenerate`, {}, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log(`✅ API key ${keyId} regenerated:`, response)),
      catchError(this.handleError)
    );
  }

  revokeApiKey(keyId: string): Observable<any> {
    console.log(`🔍 Revoking API key: ${keyId}`);
    
    return this.http.delete(`${this.apiUrl}/apikeys/${keyId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log(`✅ API key ${keyId} revoked:`, response)),
      catchError(this.handleError)
    );
  }

  validateApiKey(apiKey: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/apikeys/validate`, { apiKey }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // System Health Methods
  getSystemHealth(): Observable<any> {
    console.log('🔍 Fetching system health...');
    
    return this.http.get(`${this.apiUrl}/health`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ System health retrieved:', response)),
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('🔍 SystemConfigurationService Error:', error);
    console.error('🔍 Error Status:', error.status);
    console.error('🔍 Error Message:', error.message);
    console.error('🔍 Error Body:', error.error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 500) {
        errorMessage = error.error?.message || 'Internal server error occurred.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
      }
    }
    
    return throwError(() => error);
  };
}
