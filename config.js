// =============================================================================
// M365 POWERSHELL DASHBOARD - COMPANY CONFIGURATION
// =============================================================================
// Fill in the values below for each company deployment.
// All tenant IDs, emails, and credentials should be stored as SHA-256 hashes.
//
// To generate a hash:
//   1. Open the SHA-256 Hash Generator tool (hash-generator.html)
//   2. Type the value (email, tenant ID, username, or password)
//   3. Copy the resulting hash and paste it below
// =============================================================================

const DASHBOARD_CONFIG = {

  // =========================================================================
  // BRANDING
  // =========================================================================
  // Customize the dashboard name for this company
  companyName: "M365 PowerShell",  // Shown on login page and header

  // =========================================================================
  // MICROSOFT SSO (App Registration)
  // =========================================================================
  // 1. Go to Azure Portal → Entra ID → App registrations → New registration
  // 2. Name: "M365 PowerShell Dashboard - [CompanyName]"
  // 3. Supported account types: "Accounts in any organizational directory (Multitenant)"
  // 4. Redirect URI: Select "Single-page application (SPA)" and enter the URL below
  // 5. Copy the Application (client) ID and paste it here
  //
  // IMPORTANT: The clientId CANNOT be hashed — MSAL requires it in plaintext.
  // This is safe; Microsoft treats client IDs as public, not secrets.
  clientId: "YOUR-APP-CLIENT-ID-HERE",

  // The full URL where this dashboard is hosted
  // Must match the Redirect URI in the App Registration exactly
  redirectUri: "https://YOUR-APP.azurestaticapps.net/",

  // Microsoft login endpoint — leave as "common" for multi-tenant
  authority: "https://login.microsoftonline.com/common",

  // =========================================================================
  // ACCESS CONTROL - TENANT WHITELIST
  // =========================================================================
  // Add SHA-256 hashes of allowed Azure AD tenant IDs.
  // Any user from a whitelisted tenant can log in via Microsoft SSO.
  //
  // To find a tenant ID:
  //   Azure Portal → Entra ID → Overview → "Tenant ID"
  //
  // Then hash it and add it here.
  allowedTenantHashes: [
    // "hash-of-tenant-id-here",
  ],

  // =========================================================================
  // ACCESS CONTROL - INDIVIDUAL USER WHITELIST
  // =========================================================================
  // Add SHA-256 hashes of specific email addresses to allow.
  // Useful for personal accounts (hotmail/outlook/gmail) or
  // users from non-whitelisted tenants.
  //
  // Hash the EXACT email address that Microsoft returns at login.
  // For personal Microsoft accounts this might include #EXT# extensions —
  // if login fails, check what MSAL returns and hash that instead.
  allowedUserHashes: [
    // "hash-of-email-here",
  ],

  // =========================================================================
  // MANUAL LOGIN (non-SSO fallback)
  // =========================================================================
  // Optional: Allow one account to log in with username + password
  // instead of Microsoft SSO. Useful for the dashboard admin.
  //
  // Both values must be SHA-256 hashes.
  // Leave empty strings to disable manual login.
  //
  // Choose any username and password you like, hash both, and paste here.
  manualLogin: {
    usernameHash: "",  // SHA-256 hash of your chosen username
    passwordHash: "",  // SHA-256 hash of your chosen password
  },

  // =========================================================================
  // WHITELIST ENFORCEMENT
  // =========================================================================
  // Set to true to enforce tenant + user whitelist (recommended)
  // Set to false to allow ANY Microsoft work account to log in
  enforceWhitelist: true,

  // =========================================================================
  // COMMANDS SOURCE
  // =========================================================================
  // Path to the commands JSON file (relative to index.html)
  // Typically "./commands.json" — no need to change unless hosting elsewhere
  commandsUrl: "./commands.json",
};
