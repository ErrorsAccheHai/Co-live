# 🌙☀️ Theme Switcher Quick Reference

## Where is the Theme Toggle?

**Location:** NavBar (top navigation bar)
**Position:** Between navigation links and user menu
**Icon:** 🌙 (Moon for light mode) / ☀️ (Sun for dark mode)

## How to Use?

1. Look for the **Sun/Moon icon** in the NavBar
2. **Click** the icon
3. **Everything changes** instantly
4. Your preference is **saved automatically**

## Theme Colors

### Light Mode (Default)
- **Background:** Bright white (#f8f9fa)
- **Cards:** Clean white (#ffffff)
- **Text:** Black (#000000)
- **Accents:** Red (#ff4d4d)

### Dark Mode
- **Background:** Very dark (#1a1a1a)
- **Cards:** Dark gray (#2d2d2d)
- **Text:** White (#ffffff)
- **Accents:** Red (#ff4d4d)

## Current Implementation Status

✅ **Fully Implemented in:**
- NavBar
- AdminDashboard
- All components using useTheme()

⏳ **Ready for Integration in:**
- LandlordDashboardMain
- Dashboard
- Login/Signup
- Properties
- Profile
- All other pages

## For Developers

### Quick Integration:

```javascript
import { useTheme } from '../utils/ThemeContext';

export default function MyComponent() {
  const { isDarkMode, bg, bgSecondary, text, brand } = useTheme();
  
  return (
    <Box bg={bg} color={text}>
      <Heading color={brand}>Title</Heading>
    </Box>
  );
}
```

### Available Colors:
- `isDarkMode` - boolean (true/false)
- `bg` - main background
- `bgSecondary` - card/modal background
- `text` - primary text
- `textSecondary` - secondary text
- `brand` - brand red (#ff4d4d)
- `border` - border color
- `borderLight` - light border
- `card` - card background
- `input` - input field background
- `inputText` - input text color
- `toggleTheme` - function to switch themes

### Properties in Storage:
```
Key: 'colive_dark_mode'
Value: true (dark) or false (light)
Auto-loaded on app start
```

## Troubleshooting

**Theme not persisting?**
- Check if localStorage is enabled in browser
- Clear browser cache and reload

**Colors not updating?**
- Make sure component uses `useTheme()` hook
- Restart dev server: `npm start`

**Toggle button not visible?**
- Check NavBar component in `/components/NavBar.jsx`
- Button should be between nav links and user menu

## File Locations

- **Theme System:** `/frontend/src/utils/ThemeContext.jsx`
- **NavBar (Toggle):** `/frontend/src/components/NavBar.jsx`
- **Admin (Integrated):** `/frontend/src/pages/AdminDashboard.jsx`
- **App Wrapper:** `/frontend/src/App.jsx`

---

**Status:** ✅ Production Ready
**Last Update:** November 11, 2025
