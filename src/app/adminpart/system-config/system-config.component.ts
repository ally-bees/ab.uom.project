import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemConfigurationService, SystemConfigSummary, SecuritySettings, ApiKey, CreateApiKey, SystemHealth } from '../../services/system-configuration.service';

@Component({
  selector: 'app-system-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.css']
})
export class SystemConfigComponent implements OnInit {
  // Data properties
  configSummary: SystemConfigSummary | null = null;
  securitySettings: SecuritySettings | null = null;
  apiKeys: ApiKey[] = [];
  systemHealth: SystemHealth | null = null;
  
  // UI state
  loading = false;
  error = '';
  successMessage = '';
  activeTab = 'security';
  
  // Forms
  securityForm: FormGroup;
  apiKeyForm: FormGroup;
  
  // Modal states
  showCreateApiKeyModal = false;
  showSecurityModal = false;
  showApiKeyModal = false;
  
  constructor(
    private systemConfigService: SystemConfigurationService,
    private formBuilder: FormBuilder
  ) {
    this.securityForm = this.formBuilder.group({
      twoFactorEnabled: [false],
      sessionTimeoutMinutes: [60, [Validators.required, Validators.min(15), Validators.max(480)]],
      maxLoginAttempts: [5, [Validators.required, Validators.min(3), Validators.max(10)]],
      lockoutDurationMinutes: [30, [Validators.required, Validators.min(5), Validators.max(1440)]],
      passwordPolicy: this.formBuilder.group({
        minLength: [8, [Validators.required, Validators.min(6), Validators.max(50)]],
        requireUppercase: [true],
        requireLowercase: [true],
        requireNumbers: [true],
        requireSpecialChars: [true],
        passwordExpiryDays: [90, [Validators.min(30), Validators.max(365)]]
      })
    });

    this.apiKeyForm = this.formBuilder.group({
      keyName: ['', [Validators.required, Validators.minLength(3)]],
      permissions: [[]],
      expiresAt: ['']
    });
  }

  ngOnInit(): void {
    this.loadSystemConfiguration();
  }

  loadSystemConfiguration(): void {
    this.loading = true;
    this.error = '';

    this.systemConfigService.getSystemConfigurationSummary().subscribe({
      next: (response) => {
        if (response.success) {
          this.configSummary = response.data;
          this.securitySettings = response.data.securitySettings;
          this.apiKeys = response.data.apiKeys;
          this.systemHealth = response.data.systemHealth;
          
          // Update security form with current values
          this.populateSecurityForm();
          
          console.log('✅ System configuration loaded:', this.configSummary);
        } else {
          this.error = response.message || 'Failed to load system configuration';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading system configuration:', error);
        this.error = error.error?.message || 'Failed to load system configuration';
        this.loading = false;
      }
    });
  }

  populateSecurityForm(): void {
    if (this.securitySettings) {
      this.securityForm.patchValue({
        twoFactorEnabled: this.securitySettings.twoFactorEnabled,
        sessionTimeoutMinutes: this.securitySettings.sessionTimeoutMinutes,
        maxLoginAttempts: this.securitySettings.maxLoginAttempts,
        lockoutDurationMinutes: this.securitySettings.lockoutDurationMinutes,
        passwordPolicy: {
          minLength: this.securitySettings.passwordPolicy.minLength,
          requireUppercase: this.securitySettings.passwordPolicy.requireUppercase,
          requireLowercase: this.securitySettings.passwordPolicy.requireLowercase,
          requireNumbers: this.securitySettings.passwordPolicy.requireNumbers,
          requireSpecialChars: this.securitySettings.passwordPolicy.requireSpecialChars,
          passwordExpiryDays: this.securitySettings.passwordPolicy.passwordExpiryDays
        }
      });
    }
  }

  // Security Settings Methods
  toggleTwoFactor(): void {
    if (this.securitySettings) {
      this.securitySettings.twoFactorEnabled = !this.securitySettings.twoFactorEnabled;
      this.updateSecuritySettings();
    }
  }

  openSecurityModal(): void {
    this.populateSecurityForm();
    this.showSecurityModal = true;
  }

  closeSecurityModal(): void {
    this.showSecurityModal = false;
    this.populateSecurityForm(); // Reset form
  }

  updateSecuritySettings(): void {
    if (!this.securitySettings) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.systemConfigService.updateSecuritySettings(this.securitySettings).subscribe({
      next: (response) => {
        if (response.success) {
          this.securitySettings = response.data;
          this.successMessage = 'Security settings updated successfully';
          this.populateSecurityForm();
        } else {
          this.error = response.message || 'Failed to update security settings';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error updating security settings:', error);
        this.error = error.error?.message || 'Failed to update security settings';
        this.loading = false;
      }
    });
  }

  saveSecuritySettings(): void {
    if (this.securityForm.valid) {
      const formValue = this.securityForm.value;
      this.securitySettings = {
        ...this.securitySettings,
        twoFactorEnabled: formValue.twoFactorEnabled,
        sessionTimeoutMinutes: formValue.sessionTimeoutMinutes,
        maxLoginAttempts: formValue.maxLoginAttempts,
        lockoutDurationMinutes: formValue.lockoutDurationMinutes,
        passwordPolicy: formValue.passwordPolicy
      };
      
      this.updateSecuritySettings();
      this.closeSecurityModal();
    } else {
      this.error = 'Please fill in all required fields correctly';
    }
  }

  // API Key Methods
  openCreateApiKeyModal(): void {
    this.showApiKeyModal = true;
    this.apiKeyForm.reset({
      keyName: '',
      permissions: [],
      expiresAt: null
    });
  }

  closeApiKeyModal(): void {
    this.showApiKeyModal = false;
    this.apiKeyForm.reset();
  }

  onCreateApiKey(): void {
    if (!this.apiKeyForm.valid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    const createApiKeyData = {
      keyName: this.apiKeyForm.get('keyName')?.value,
      permissions: this.apiKeyForm.get('permissions')?.value || [],
      expiresAt: this.apiKeyForm.get('expiresAt')?.value || null
    };

    this.systemConfigService.createApiKey(createApiKeyData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `API key "${createApiKeyData.keyName}" created successfully!`;
          this.closeApiKeyModal();
          this.loadSystemConfiguration(); // Reload to show new API key
          
          // Show the new API key value (this is the only time it will be shown in full)
          if (response.data?.keyValue) {
            alert(`⚠️ IMPORTANT: Save this API key now - it won't be shown again!\n\nAPI Key: ${response.data.keyValue}`);
          }
        } else {
          this.error = response.message || 'Failed to create API key';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error creating API key:', error);
        this.error = error.error?.message || 'Failed to create API key';
        this.loading = false;
      }
    });
  }

  regenerateApiKey(keyId: string): void {
    if (confirm('Are you sure you want to regenerate this API key? The old key will be invalidated.')) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      this.systemConfigService.regenerateApiKey(keyId).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'API key regenerated successfully';
            this.loadSystemConfiguration(); // Reload to get updated API keys
          } else {
            this.error = response.message || 'Failed to regenerate API key';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error regenerating API key:', error);
          this.error = error.error?.message || 'Failed to regenerate API key';
          this.loading = false;
        }
      });
    }
  }

  revokeApiKey(keyId: string): void {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      this.systemConfigService.revokeApiKey(keyId).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'API key revoked successfully';
            this.loadSystemConfiguration(); // Reload to get updated API keys
          } else {
            this.error = response.message || 'Failed to revoke API key';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error revoking API key:', error);
          this.error = error.error?.message || 'Failed to revoke API key';
          this.loading = false;
        }
      });
    }
  }

  // Utility Methods
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.error = '';
    this.successMessage = '';
  }

  clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }

  getHealthStatusClass(isHealthy: boolean): string {
    return isHealthy ? 'status-healthy' : 'status-unhealthy';
  }

  getHealthStatusText(isHealthy: boolean): string {
    return isHealthy ? 'Healthy' : 'Unhealthy';
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: Date | string): string {
    if (!date) return 'Never';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.successMessage = 'API key copied to clipboard';
      setTimeout(() => this.clearMessages(), 3000);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
      this.error = 'Failed to copy to clipboard';
    });
  }
}