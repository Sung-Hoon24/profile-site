# Notebook Unit 02: Stitch Design System

## 1. Design Philosophy
**Theme**: "Stitch" (Cyberpunk / Future Tech)
**Keywords**: Neon, Glassmorphism, Dark Mode, Floating Orbs, Grid Overlays.

## 2. Color Palette
| Variable | Color Code | Description |
| :--- | :--- | :--- |
| `--stitch-bg` | `#0f0f19` | Deep Space Background |
| `--stitch-primary` | `#00e5ff` | Neon Cyan (Active, Highlights) |
| `--stitch-secondary` | `#ff4081` | Neon Pink (Accents, Buttons) |
| `--stitch-accent` | `#7c4dff` | Electric Purple (Gradients) |
| `--glass-bg` | `rgba(255, 255, 255, 0.05)` | Glass Panes |
| `--glass-border` | `rgba(255, 255, 255, 0.1)` | Subtle Borders |

## 3. Typography
- **Headings**: `Outfit` (Bold, Modern, Sans-serif)
- **Body**: `Outfit` (Clean, Readable)
- **Accents**: `Orbitron` (Robotic, optionally used for numbers/badges)

## 4. Core UI Components
- **Input Fields**: Dark backgrounds with bottom borders that glow Cyan on focus.
- **Buttons**:
    - `Primary`: Cyan/Pink Gradient Background, Rounded.
    - `Secondary`: Transparent with White Border, Hover Glow.
- **Modals**: Centered, Glassmorphism backdrop blur (`backdrop-filter: blur(10px)`).

## 5. Animations
- **Float**: Gentle vertical movement for background orbs.
- **Glow**: Box-shadow pulsing for active elements (`0 0 15px var(--stitch-primary)`).
- **Slide-In**: Smooth entry for modals and menus.
