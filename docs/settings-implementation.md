# Settings Page Implementation Guide

This document outlines the implementation of the settings page and theme system for Hope Autos.

## 🎯 Features Implemented

### 1. **User Profile Management**
- Update name, email, phone, and bio
- Display user avatar and role badge
- Real-time profile updates with session refresh

### 2. **Theme System**
- Light/Dark/System theme options
- Persistent theme selection
- Smooth transitions between themes
- Custom scrollbar styling for both themes

### 3. **Notification Preferences**
- Email and SMS notification toggles
- Granular control over notification types:
  - Price alerts
  - New arrivals
  - Marketing updates

### 4. **Search Preferences**
- Maximum price range setting
- Preferred car makes (multi-select badges)
- Preferred fuel types
- Preferred body types

### 5. **Privacy Settings**
- Profile visibility controls
- Email/phone display preferences
- Data privacy management

## 📁 Files Added/Modified

### New Files Created:
\`\`\`
app/settings/page.tsx              # Main settings page component
app/settings/loading.tsx           # Loading state for settings
app/api/user/preferences/route.ts  # API for user preferences
app/api/user/profile/route.ts      # API for profile updates
app/components/ThemeProvider.tsx   # Theme context provider
docs/settings-implementation.md   # This documentation
\`\`\`

### Files Modified:
\`\`\`
app/layout.tsx                     # Added ThemeProvider and Toaster
app/globals.css                    # Added dark mode CSS variables
lib/types.ts                       # Extended with UserPreferences type
lib/db.ts                          # Added updateUserPreferences function
\`\`\`

## 🔧 Implementation Steps

### Step 1: Install Required Dependencies
\`\`\`bash
npm install next-themes
\`\`\`

### Step 2: Update Database Schema (if needed)
Add these fields to your user preferences table:
\`\`\`sql
-- Add to UserPreferences table
ALTER TABLE UserPreferences ADD COLUMN maxPrice INTEGER;
ALTER TABLE UserPreferences ADD COLUMN preferredMakes TEXT[];
ALTER TABLE UserPreferences ADD COLUMN preferredFuelTypes TEXT[];
ALTER TABLE UserPreferences ADD COLUMN preferredBodyTypes TEXT[];
ALTER TABLE UserPreferences ADD COLUMN profileVisible BOOLEAN DEFAULT true;
ALTER TABLE UserPreferences ADD COLUMN showEmail BOOLEAN DEFAULT false;
ALTER TABLE UserPreferences ADD COLUMN showPhone BOOLEAN DEFAULT false;
ALTER TABLE UserPreferences ADD COLUMN marketingNotifications BOOLEAN DEFAULT false;
\`\`\`

### Step 3: Update Navigation
Add settings link to your header navigation:
\`\`\`tsx
// In app/components/Header.tsx - add to dropdown menu
<DropdownMenuItem asChild>
  <Link href="/settings" className="cursor-pointer">
    <Settings className="mr-2 h-4 w-4" />
    Settings
  </Link>
</DropdownMenuItem>
\`\`\`

### Step 4: Update Database Functions
Ensure your `lib/db.ts` includes the `updateUserPreferences` function:
\`\`\`typescript
export async function updateUserPreferences(
  userId: string, 
  preferences: Partial<UserPreferences>
): Promise<boolean> {
  // Implementation already provided in the updated file
}
\`\`\`

## 🎨 Theme System Usage

### Using Theme in Components:
\`\`\`tsx
import { useTheme } from "next-themes"

function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </button>
  )
}
\`\`\`

### CSS Classes for Theme-Aware Styling:
\`\`\`css
/* Light mode styles */
.bg-background text-foreground

/* Dark mode styles (automatically applied) */
.dark .bg-background .text-foreground
\`\`\`

## 🔒 Security Considerations

### 1. **Profile Updates**
- Email changes should require verification in production
- Phone number validation recommended
- Rate limiting on profile updates

### 2. **Preferences Storage**
- All preferences stored server-side
- User authentication required for all operations
- Input validation on all preference updates

### 3. **Privacy Settings**
- Respect user privacy choices throughout the app
- Implement data export/deletion features for GDPR compliance

## 🚀 Usage Examples

### Accessing User Preferences:
\`\`\`tsx
// In any component
const [preferences, setPreferences] = useState<UserPreferences>()

useEffect(() => {
  fetch('/api/user/preferences')
    .then(res => res.json())
    .then(data => setPreferences(data.preferences))
}, [])
\`\`\`

### Updating Preferences:
\`\`\`tsx
const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
  const response = await fetch('/api/user/preferences', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferences: newPreferences })
  })
  
  if (response.ok) {
    // Handle success
  }
}
\`\`\`

## 🎯 Future Enhancements

### Planned Features:
1. **Advanced Theme Customization**
   - Custom color schemes
   - Font size preferences
   - Layout density options

2. **Enhanced Privacy**
   - Data export functionality
   - Account deletion
   - Privacy audit log

3. **Notification Management**
   - Push notifications
   - Notification history
   - Custom notification schedules

4. **Search Preferences**
   - Saved searches
   - Search alerts
   - Advanced filtering options

## 🐛 Troubleshooting

### Common Issues:

1. **Theme not persisting**
   - Ensure `suppressHydrationWarning` is set on html tag
   - Check localStorage permissions

2. **Preferences not saving**
   - Verify API routes are working
   - Check user authentication
   - Validate request payload

3. **Dark mode flickering**
   - Ensure ThemeProvider is at root level
   - Use `disableTransitionOnChange` prop

## 📱 Mobile Responsiveness

The settings page is fully responsive with:
- Collapsible cards on mobile
- Touch-friendly toggles and buttons
- Optimized spacing for small screens
- Accessible form controls

## ♿ Accessibility Features

- Proper ARIA labels on all form controls
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly descriptions
- Focus management for modals and dropdowns
