# How to Publish to npm - Complete Guide

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/signup)
2. **Login**: Make sure you're logged in to npm

## Step-by-Step Publishing Guide

### Step 1: Login to npm

```bash
npm login
```

You'll be prompted for:
- Username
- Password
- Email
- OTP (if 2FA is enabled)

### Step 2: Verify Package Configuration

Check your `package.json` has:
- ✅ Unique package name (check if available on npm)
- ✅ Version number
- ✅ Author information
- ✅ License
- ✅ Repository URL (optional but recommended)

### Step 3: Check Package Name Availability

```bash
npm view react-image-cropper-pro
```

If it shows "404", the name is available. If it shows package info, the name is taken.

### Step 4: Build the Package

```bash
npm run build
```

This creates the `dist` folder with compiled code.

### Step 5: Test the Build Locally (Optional)

```bash
# Create a test package
npm pack

# This creates a .tgz file you can test
```

### Step 6: Publish to npm

#### For First Time Publishing:

```bash
npm publish
```

#### For Updates:

```bash
# Update version first
npm version patch   # for bug fixes (1.0.0 -> 1.0.1)
npm version minor   # for new features (1.0.0 -> 1.1.0)
npm version major   # for breaking changes (1.0.0 -> 2.0.0)

# Then publish
npm publish
```

### Step 7: Verify Publication

Check your package on npm:
```
https://www.npmjs.com/package/react-image-cropper-pro
```

## Important Notes

### Package Name
- Must be unique on npm
- Can contain lowercase letters, numbers, hyphens, underscores
- Cannot start with a dot or underscore
- Cannot contain uppercase letters

### Version Format
Follows [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH` (e.g., 1.0.0)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Files Included
Only files listed in `package.json` `files` array will be published:
```json
"files": [
  "dist",
  "README.md"
]
```

### Scoped Packages (Optional)
If you want to publish under your username:
```json
"name": "@yourusername/react-image-cropper-pro"
```

Then publish with:
```bash
npm publish --access public
```

## Troubleshooting

### Error: "You must verify your email"
- Go to npmjs.com and verify your email

### Error: "Package name already exists"
- Choose a different name in package.json
- Or use scoped package: `@yourusername/package-name`

### Error: "403 Forbidden"
- Check if you're logged in: `npm whoami`
- Verify package name ownership

### Error: "Invalid package name"
- Check package name follows npm naming rules
- No uppercase letters
- No special characters except hyphens and underscores

## Quick Publish Commands

```bash
# 1. Login
npm login

# 2. Build
npm run build

# 3. Publish
npm publish

# Or with version bump
npm version patch && npm publish
```

## After Publishing

1. **Install and Test**:
   ```bash
   npm install react-image-cropper-pro
   ```

2. **Update README** with npm install instructions

3. **Tag Release on GitHub** (optional):
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## Updating the Package

1. Make your changes
2. Update version: `npm version patch`
3. Build: `npm run build`
4. Publish: `npm publish`

That's it! Your package is now on npm! 🎉

