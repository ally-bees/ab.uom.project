// flags.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {
  // You'll need to create these SVG files in your assets folder
  // Here's the content for each flag:

  // Switzerland flag (ch.svg)
  readonly switzerlandFlag = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24">
      <rect width="32" height="24" fill="#FF0000"/>
      <rect x="13" y="6" width="6" height="12" fill="#FFFFFF"/>
      <rect x="7" y="9" width="18" height="6" fill="#FFFFFF"/>
    </svg>
  `;

  // United States flag (us.svg)
  readonly usFlag = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24">
      <rect width="32" height="24" fill="#FFFFFF"/>
      <rect y="0" width="32" height="1.85" fill="#B22234"/>
      <rect y="3.7" width="32" height="1.85" fill="#B22234"/>
      <rect y="7.4" width="32" height="1.85" fill="#B22234"/>
      <rect y="11.1" width="32" height="1.85" fill="#B22234"/>
      <rect y="14.8" width="32" height="1.85" fill="#B22234"/>
      <rect y="18.5" width="32" height="1.85" fill="#B22234"/>
      <rect y="22.2" width="32" height="1.85" fill="#B22234"/>
      <rect width="12.8" height="12.8" fill="#3C3B6E"/>
    </svg>
  `;

  // United Kingdom flag (gb.svg)
  readonly ukFlag = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24">
      <rect width="32" height="24" fill="#012169"/>
      <path d="M0,0 L32,24 M32,0 L0,24" stroke="#FFFFFF" stroke-width="4"/>
      <path d="M16,0 L16,24 M0,12 L32,12" stroke="#FFFFFF" stroke-width="6"/>
      <path d="M16,0 L16,24 M0,12 L32,12" stroke="#C8102E" stroke-width="4"/>
      <path d="M0,0 L32,24 M32,0 L0,24" stroke="#C8102E" stroke-width="2"/>
    </svg>
  `;

  constructor() {}

  // Method to get SVG content for a flag
  getFlagSvg(countryCode: string): string {
    switch(countryCode.toLowerCase()) {
      case 'ch': return this.switzerlandFlag;
      case 'us': return this.usFlag;
      case 'gb': return this.ukFlag;
      default: return '';
    }
  }
}
