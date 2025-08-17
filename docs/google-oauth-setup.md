# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for Hope Autos.

## 🚀 Quick Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it "Hope Autos" or similar

### 2. Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" if available

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** (unless you have Google Workspace)
3. Fill in the required information:
   - **App name**: Hope Autos
   - **User support email**: your-email@example.com
   - **Developer contact**: your-email@example.com
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Add test users (your email addresses for testing)
6. Save and continue

### 4. Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Configure:
   - **Name**: Hope Autos Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. Save and copy the **Client ID** and **Client Secret**

### 5. Environment Variables

Add to your `.env.local` file:

\`\`\`env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth (required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Database (required)
DATABASE_URL=your-database-url-here
\`\`\`

### 6. Test the Setup

1. Restart your development server: `npm run dev`
2. Go to `/auth/signin`
3. Click "Continue with Google"
4. Complete the OAuth flow

## 🔧 Troubleshooting Common Issues

### Error: "redirect_uri_mismatch"

**Problem**: The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution**:
1. Check your Google Cloud Console OAuth client settings
2. Ensure the redirect URI exactly matches: `http://localhost:3000/api/auth/callback/google`
3. For production, use: `https://yourdomain.com/api/auth/callback/google`

### Error: "access_denied"

**Problem**: User cancelled the OAuth flow or app isn't approved.

**Solutions**:
1. Make sure OAuth consent screen is properly configured
2. Add your email as a test user
3. Check if the app needs verification (for production)

### Error: "invalid_client"

**Problem**: Client ID or Client Secret is incorrect.

**Solutions**:
1. Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Ensure no extra spaces or characters
3. Regenerate credentials if needed

### Error: "OAuthAccountNotLinked"

**Problem**: User has an existing account with the same email.

**Solutions**:
1. Sign in with email/password first
2. Link Google account in user settings
3. Or use a different email for Google OAuth

### Error: "Configuration"

**Problem**: NextAuth configuration issue.

**Solutions**:
1. Ensure `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Verify database connection

## 🔒 Security Best Practices

### Development
- Use `http://localhost:3000` for local development
- Keep credentials in `.env.local` (never commit to git)
- Use test users for OAuth consent screen

### Production
- Always use HTTPS (`https://yourdomain.com`)
- Set up proper domain verification
- Submit app for verification if needed
- Use environment variables for credentials
- Enable additional security features

## 📋 Production Checklist

Before going live:

- [ ] OAuth consent screen is properly configured
- [ ] Production domain is added to authorized origins
- [ ] Production callback URL is configured
- [ ] App verification is complete (if required)
- [ ] Environment variables are set in production
- [ ] HTTPS is enabled
- [ ] Error handling is tested

## 🎯 Advanced Configuration

### Custom Scopes
If you need additional user information:

\`\`\`typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    params: {
      scope: "openid email profile",
      prompt: "consent",
      access_type: "offline",
      response_type: "code"
    }
  }
})
\`\`\`

### Profile Customization
To get additional user data:

\`\`\`typescript
GoogleProvider({
  // ... other config
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      // Add custom fields
      locale: profile.locale,
      verified: profile.email_verified
    }
  }
})
\`\`\`

## 🆘 Getting Help

If you're still having issues:

1. Check the [NextAuth.js documentation](https://next-auth.js.org/providers/google)
2. Review [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)
3. Check browser console for detailed error messages
4. Verify all environment variables are correctly set
5. Test with a fresh incognito/private browser window

## 📝 Testing Accounts

For development, create test accounts:
- Add your personal Gmail to test users
- Use different browsers to test multiple accounts
- Test both new user registration and existing user login

---

Your Google OAuth should now be working! 🎉
\`\`\`

Finally, let's update the environment example with better Google OAuth instructions:
