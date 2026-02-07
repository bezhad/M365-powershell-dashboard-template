# M365 PowerShell Dashboard

A self hosted, read-only PowerShell command generator for Microsoft 365 administration with Microsoft SSO authentication. Users sign in with their work account, pick a task, fill in parameters, and copy the generated command.

## Repository Structure

```
├── index.html                  ← Dashboard app (generic, don't modify)
├── config.js                   ← Company-specific settings (edit this)
├── commands.json               ← PowerShell commands library (edit this)
├── admin.html                  ← Local admin editor (blocked from public site)
├── hash-generator.html         ← SHA-256 hash tool (blocked from public site)
├── staticwebapp.config.json    ← Route config (blocks admin + hash-generator)
└── README.md                   ← This file
```

### File Details

**Deployed to site (public):**
- `index.html` — Dashboard UI with SSO login. Generic, don't modify.
- `config.js` — Auth, branding, access control. **Edit per company.**
- `commands.json` — PowerShell command library. **Edit per company.**
- `staticwebapp.config.json` — Route config. Blocks admin tools from public access.

**In repo but blocked from site:**
- `admin.html` — GUI for editing commands locally. Open in browser, not deployed.
- `hash-generator.html` — SHA-256 hash tool. Open in browser, not deployed.

---

## Quick Setup (New Company Deployment)

### Step 1: Create a repo from this template

Click **"Use this template"** → **"Create a new repository"** on GitHub.

### Step 2: Create an App Registration in Azure

1. Go to **Azure Portal** → **Entra ID** → **App registrations** → **New registration**
2. **Name:** `M365 Dashboard - [CompanyName]`
3. **Supported account types:** "Accounts in any organizational directory (Multitenant)"
4. **Redirect URI:** Select **Single-page application (SPA)** — leave the URL blank for now
5. Click **Register**
6. Copy the **Application (client) ID** — you'll need this for `config.js`

### Step 3: Create an Azure Static Web App

1. Go to **Azure Portal** → **Static Web Apps** → **Create**
2. **Plan:** Free
3. **Source:** GitHub → select your new repo
4. **Branch:** main
5. **Build preset:** Custom
6. **App location:** `/`
7. Click **Create** and wait for deployment
8. Copy the URL (e.g. `https://your-app.azurestaticapps.net`)

### Step 4: Update the App Registration redirect URI

1. Go back to your App Registration → **Authentication**
2. Under **Single-page application**, add your Azure URL: `https://your-app.azurestaticapps.net/`
3. **Save**

### Step 5: Generate hashes

1. Open `hash-generator.html` locally in your browser (download or clone the repo first)
2. Generate hashes for:
   - The company's **Azure AD tenant ID** (found in Azure Portal → Entra ID → Overview → Tenant ID)
   - Any individual **email addresses** to whitelist (for personal accounts)
   - A **username** and **password** for the manual login fallback (optional)

> The hash generator runs entirely in your browser. No data is sent anywhere.

### Step 6: Edit config.js

Fill in all values in `config.js`. Every setting is documented with comments explaining what it does and where to find the values. At minimum you need:

```javascript
const DASHBOARD_CONFIG = {
  companyName: "Company Name",                    // Shown on login page
  clientId: "your-client-id-from-step-2",         // From App Registration
  redirectUri: "https://your-app.azurestaticapps.net/",  // Your Azure URL

  allowedTenantHashes: [
    "hash-of-company-tenant-id",                  // From hash generator
  ],

  // ... see config.js for all options
};
```

### Step 7: Customize commands

Either edit `commands.json` directly, or use the admin editor (recommended):

1. Open `admin.html` locally in your browser
2. Log in with the admin password (default: `admin123` — change it in the file)
3. Add, edit, or delete commands and services
4. Click **Settings** → **Export Config (JSON)**
5. Replace the contents of `commands.json` in the repo with the exported file

### Step 8: Commit and deploy

Push your changes to the main branch. Azure auto-deploys within ~30 seconds.

---

## Ongoing Workflow

### Updating commands

1. Open `admin.html` locally
2. Click **Settings** → **Import** → select your current `commands.json`
3. Make changes (add/edit/delete commands)
4. Click **Settings** → **Export Config (JSON)**
5. Go to GitHub → edit `commands.json` → paste exported content → commit
6. Azure auto-deploys, users refresh to see updates

### Adding a new tenant or user

1. Get the tenant ID or email address
2. Hash it using `hash-generator.html`
3. Add the hash to the appropriate array in `config.js`
4. Commit and push

### First login from a new tenant

When the first user from a new tenant tries to log in, they may see a consent prompt. If their tenant requires admin consent for new apps, one of their IT admins needs to approve it once. After that, all users from that tenant can log in.

---

## Authentication

The dashboard supports two login methods:

### Microsoft SSO (primary)

Users sign in with their Microsoft work account. Access is controlled by:

- **Tenant whitelist** — Any user from a whitelisted Azure AD tenant can log in
- **User whitelist** — Individual email addresses can be whitelisted (useful for personal accounts like hotmail/outlook)

### Manual login (fallback)

A single username/password account for the dashboard admin. Useful when SSO isn't working or for personal accounts that don't support multi-tenant login. Both credentials are stored as SHA-256 hashes.

To disable manual login, leave the hash fields empty in `config.js`.

---

## Command Structure

### Service

```json
{
  "name": "Service Name",
  "icon": "emoji",
  "tasks": { ... }
}
```

### Command

```json
{
  "name": "Command Display Name",
  "params": ["Param1", "Param2"],
  "scopes": ["Scope.Read.All"],
  "cmd": "PowerShell command with {Param1} and {Param2}"
}
```

Parameters use `{ParamName}` placeholders that get replaced with user input. Scopes are Microsoft Graph API permissions shown in the Connection Helper.

### Full example

```json
{
  "connections": {
    "graph": {
      "name": "Microsoft Graph",
      "cmd": "Connect-MgGraph -Scopes \"{scopes}\"",
      "placeholder": "User.Read.All"
    }
  },
  "tasks": {
    "entra": {
      "name": "Entra ID",
      "icon": "👥",
      "tasks": {
        "listUsers": {
          "name": "List All Users",
          "params": [],
          "scopes": ["User.Read.All"],
          "cmd": "Get-MgUser -All | Select-Object DisplayName, UserPrincipalName"
        }
      }
    }
  }
}
```

---

## Security

- **Tenant IDs, emails, and credentials** are stored as SHA-256 hashes — cannot be reversed
- **Client ID** is in plaintext — this is by design, Microsoft treats these as public values
- **Admin editing** is local only — `admin.html` is blocked from the public site
- **SSO tokens** are stored in sessionStorage and cleared when the browser tab closes
- **The published site is read-only** — no editing capabilities are exposed

---

## Troubleshooting

**"Missing config.js"**
Make sure `config.js` is in the repo root alongside `index.html`.

**"Checking authentication..." hangs**
MSAL library failed to load. Hard refresh with Ctrl+Shift+R.

**"Not authorized" after SSO**
Tenant ID or email hash is missing from `config.js`.

**"Admin approval required" at login**
The tenant's IT admin needs to consent to the app once.

**Popup blocked during login**
Dashboard uses redirect login. Clear browser cache and retry.

**Commands not loading**
Check that `commands.json` exists in the repo and is valid JSON.

**Admin or hash-generator accessible on live site**
Make sure `staticwebapp.config.json` is in the repo.

**Manual login option not showing**
`usernameHash` and `passwordHash` are empty in `config.js`.

## Example images:

<img width="1048" height="627" alt="image" src="https://github.com/user-attachments/assets/aac31912-d1ca-4bab-b48d-98768613599e" />

<img width="832" height="621" alt="image" src="https://github.com/user-attachments/assets/b006e36a-fed6-4666-8688-b52bcb534a0f" />


