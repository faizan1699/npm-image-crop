# Fix 2FA Requirement for npm Publishing

## Error Message
```
403 Forbidden - Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

## Solution Options

### Option 1: Enable 2FA on npm (Recommended)

1. **Go to npm website:**
   - Visit: https://www.npmjs.com/settings/faizanrasheed/tokens
   - Or: https://www.npmjs.com → Your Profile → Access Tokens

2. **Enable 2FA:**
   - Go to: https://www.npmjs.com/settings/faizanrasheed/security
   - Click "Enable 2FA"
   - Follow the setup instructions
   - Use an authenticator app (Google Authenticator, Authy, etc.)

3. **After enabling 2FA:**
   ```bash
   npm login
   # Enter OTP when prompted
   npm publish
   ```

### Option 2: Create Granular Access Token (Alternative)

1. **Create Access Token:**
   - Go to: https://www.npmjs.com/settings/faizanrasheed/tokens
   - Click "Generate New Token"
   - Select "Granular Access Token"
   - Set permissions:
     - Package: react-image-cropper-pro
     - Permissions: Read and Write
     - Check "Bypass 2FA" if available
   - Copy the token

2. **Use Token for Publishing:**
   ```bash
   # Set token as environment variable
   export NPM_TOKEN=your_token_here
   
   # Or use .npmrc file
   echo "//registry.npmjs.org/:_authToken=your_token_here" > ~/.npmrc
   
   # Then publish
   npm publish
   ```

### Option 3: Use npm login with 2FA

If you already have 2FA enabled:
```bash
npm login
# Enter username, password, email
# Enter OTP from authenticator app
npm publish
```

## Quick Fix Commands

```bash
# 1. Login again (will prompt for 2FA if enabled)
npm login

# 2. Publish
npm publish
```

## Verify 2FA Status

Check if 2FA is enabled:
- Visit: https://www.npmjs.com/settings/faizanrasheed/security
- Look for "Two-factor authentication" status

