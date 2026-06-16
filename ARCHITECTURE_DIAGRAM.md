# 🏗️ Co-Live Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         App.jsx (Main)                              │
│  Wraps entire app with ThemeProvider - provides global theme state  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
         ┌──────▼──────┐           ┌─────────▼──────────┐
         │ ThemeContext│           │    AppContent      │
         │  - Theme    │           │  - Routes setup    │
         │    state    │           │  - Background      │
         │  - Colors   │           │  - Main layout     │
         │  - Toggle   │           │                    │
         └──────┬──────┘           └────────┬───────────┘
                │                          │
                └──────────┬───────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
       ┌────▼────┐    ┌───▼────┐    ┌──▼─────────────┐
       │ NavBar  │    │ Routes │    │ Global Styles │
       │ (Theme  │    │        │    │                │
       │ Toggle) │    │        │    │                │
       └────┬────┘    └───┬────┘    └────────────────┘
            │             │
            │        ┌────┴──────────────┐
            │        │                   │
    ┌───────▼────────▼──────┐    ┌──────▼──────────┐
    │   AdminDashboard      │    │ OtherPages      │
    │  - Sidebar            │    │ - Dashboard     │
    │  - Properties Tab     │    │ - Login/Signup  │
    │  - Verification Tab   │    │ - Properties    │
    │  - Theme support      │    │ - Profile       │
    │  (Full colors applied)│    │                 │
    └───────────────────────┘    └─────────────────┘
```

## Theme Flow Diagram

```
User Clicks Theme Icon in NavBar
         │
         ▼
     toggleTheme()
         │
         ├─► isDarkMode = !isDarkMode
         │
         ├─► localStorage.setItem('colive_dark_mode', isDarkMode)
         │
         ├─► window.dispatchEvent('themeChanged')
         │
         └─► Re-render all components with new colors
                     │
         ┌───────────┼───────────┐
         │           │           │
      NavBar      Admin       Dashboard
       Moon      Dark Mode    Dark Mode
       ░░░░░     ▓▓▓▓▓▓▓      ░░░░░░░
      colors     colors       colors
```

## Component Hierarchy with Theme Support

```
App
├── ThemeProvider (wraps everything)
│   └── AppContent
│       ├── NavBar ✅ (Theme colors + toggle button)
│       │   └── Theme Toggle Button
│       │       - Light/Dark toggle
│       │       - Icon changes based on isDarkMode
│       │
│       └── Routes
│           ├── Landing (public)
│           ├── Login (public)
│           ├── Signup (public)
│           ├── Dashboard (tenant) ✅ (Brand colors)
│           ├── AdminDashboard ✅ (Full theme support)
│           │   ├── Sidebar (theme colors)
│           │   ├── Verification Tab
│           │   ├── Properties Tab
│           │   │   └── AdminPropertyView ✅ (theme props)
│           │   │       └── Removal Modal ✅ (theme colors)
│           │   └── Debug Tab
│           ├── LandlordDashboard ✅ (Theme ready)
│           │   ├── Overview Tab
│           │   ├── Properties Tab (MyProperties)
│           │   └── Requests Tab
│           ├── Profile (ready for theme)
│           ├── Properties (ready for theme)
│           └── Requests (ready for theme)
```

## Data Flow: Theme Change

```
┌─────────────────────────────────────────────────────────────────┐
│                    ThemeContext (Source)                        │
│  const [isDarkMode, setIsDarkMode] = useState(...)             │
│  const toggleTheme = () => setIsDarkMode(!isDarkMode)          │
│  const colors = isDarkMode ? darkTheme : lightTheme            │
└──────────┬────────────────────────────────────────────────────┘
           │
           │ Provides via Context
           │
    ┌──────▼──────────────────────────────────────┐
    │  useTheme() Hook (All components can use)   │
    │  - isDarkMode                               │
    │  - bg, bgSecondary, text                    │
    │  - brand, border, card                      │
    │  - toggleTheme function                     │
    └──────┬───────────────────────────────────────┘
           │
    ┌──────┴──────────────────────────────────────────────┐
    │                                                     │
┌───▼────────┐  ┌─────────────┐  ┌────────────────┐     │
│ Component  │  │ useTheme()  │  │ Use colors in  │  ┌──▼───────┐
│ imports    │  │ Get theme   │  │ JSX rendering │  │ Component│
│ useTheme   │  │ colors      │  │                │  │ renders  │
│            │  │ and toggle  │  │ <Box bg={bg}   │  │ with     │
└────────────┘  └─────────────┘  │ color={text}>  │  │ theme    │
                                  └────────────────┘  │ colors   │
                                                      └──────────┘
```

## Color Application Pattern

```
Light Mode Active
    │
    ├─ Sidebar: #ffffff (white)
    ├─ Text: #000000 (black)
    ├─ Hover: #ffcccc (light red)
    ├─ Cards: #ffffff (white)
    └─ Brand: #ff4d4d (red)
            │
            ▼
    User sees: Clean, bright interface


Dark Mode Active
    │
    ├─ Sidebar: #2d2d2d (dark gray)
    ├─ Text: #ffffff (white)
    ├─ Hover: #404040 (darker gray)
    ├─ Cards: #2d2d2d (dark gray)
    └─ Brand: #ff4d4d (red - consistent)
            │
            ▼
    User sees: Dark, comfortable interface
```

## File Dependencies

```
ThemeContext.jsx (independent)
    │
    ├─ used by App.jsx
    │
    ├─ used by NavBar.jsx
    │
    ├─ used by AdminDashboard.jsx
    │
    ├─ ready for: LandlordDashboard.jsx
    ├─ ready for: Dashboard.jsx
    ├─ ready for: Login.jsx
    ├─ ready for: Signup.jsx
    └─ ready for: All other components
```

## LocalStorage Integration

```
Browser Session 1
    │
    ├─ User selects Dark Mode
    ├─ localStorage['colive_dark_mode'] = true
    ├─ Theme applied to all components
    └─ User closes browser


Browser Session 2 (Later)
    │
    ├─ User visits site again
    ├─ App loads ThemeContext
    ├─ useEffect reads localStorage
    ├─ isDarkMode = JSON.parse(localStorage['colive_dark_mode'])
    ├─ Dark Mode automatically activated
    └─ User's preference restored!
```

## Feature Integration Timeline

```
Phase 1: UI Redesign ✅
├─ AdminDashboard sidebar
├─ LandlordDashboard redesign
└─ Dashboard brand colors

Phase 2: Navigation ✅
├─ NavBar brand colors
├─ Working sidebars
└─ Consolidated logout

Phase 3: Theme System ✅
├─ ThemeContext creation
├─ Dark/Light color palettes
├─ NavBar toggle button
└─ AdminDashboard theme integration

Phase 4: Expansion 🔄
├─ LandlordDashboard theme support
├─ Dashboard theme support
├─ Login/Signup theme support
└─ All pages theme support

Phase 5: Backend 🔄
├─ DELETE property endpoint
├─ Landlord notifications
└─ Full feature completion
```

## Key Components & Their Roles

| Component | Role | Theme Support |
|-----------|------|----------------|
| ThemeContext | Manage theme state globally | N/A (IS the theme) |
| App.jsx | Provide theme to all children | Provider wrapper |
| NavBar | Show toggle button, apply colors | ✅ Full support |
| AdminDashboard | Use theme for all UI | ✅ Full support |
| useTheme() hook | Distribute theme values | Consumers |
| localStorage | Persist user preference | Automatic |

---

## Quick Integration Checklist

To add theme support to a new component:

- [ ] Import `useTheme` from `../utils/ThemeContext`
- [ ] Call `const { isDarkMode, bg, text, brand } = useTheme()`
- [ ] Replace hardcoded colors with theme variables
- [ ] Add conditional hover effects for dark/light
- [ ] Test in both light and dark modes
- [ ] Check localStorage persistence
- [ ] Verify all text is readable in both modes
- [ ] Test on different screen sizes

✅ **Done!**

---

**Architecture Status:** ✅ Production Ready
**Build Date:** November 11, 2025
**Next Milestone:** Complete backend DELETE endpoint
