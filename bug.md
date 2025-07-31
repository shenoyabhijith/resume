# Bug Tracking

## Resolved Issues ✅

### Terminal Output Rendering
- **Issue**: Command output was rendering above the command line instead of below
- **Fix**: Modified `handleKeyDown` in `src/js/terminal.js` to remove the duplicate output line
- **Status**: ✅ RESOLVED

### Auto-scrolling
- **Issue**: Terminal wasn't auto-scrolling smoothly when new content was added
- **Fix**: Added `requestAnimationFrame(() => { this.scrollToBottom(); })` in `typeWriter` and `printLine` methods
- **Status**: ✅ RESOLVED

### Dynamic Input Line
- **Issue**: Input line was fixed at bottom, should follow content
- **Fix**: Added `recreateInputLine()` method and moved input line inside output container
- **Status**: ✅ RESOLVED

### GitHub Pages Deployment Issues
- **Issue**: Multiple deployment problems with old code showing
- **Fix**: Proper build script and gh-pages branch management
- **Status**: ✅ RESOLVED

### Built HTML Hardcoded Issues
- **Issue**: Built HTML contained development-only code causing errors
- **Fix**: Added `removeDevCode()` function in `build.js` to strip live reload scripts
- **Status**: ✅ RESOLVED

### JavaScript Minification Issues
- **Issue**: Minification was corrupting JSON-LD schema and causing prompt to be hardcoded
- **Fix**: Temporarily disabled JavaScript minification in `build.js`
- **Status**: ✅ RESOLVED

### Certifications & Awards Display
- **Issue**: Certifications and awards were showing as plain text instead of styled cards
- **Fix**: Added `displaySpecialContent()` function with proper CSS classes and scroll handling
- **Status**: ✅ RESOLVED

### Settings Functionality
- **Issue**: Settings were broken with POST request errors and poor UI
- **Fix**: Made settings client-side only, simplified form generation, improved UI styling
- **Status**: ✅ RESOLVED

### Help Menu Duplicates
- **Issue**: "certifications" and "awards" appeared twice in help menu
- **Fix**: Removed explicit additions from `showHelp()` method
- **Status**: ✅ RESOLVED

### Certifications & Awards Styling
- **Issue**: Card-based design not displaying properly due to missing scroll calls
- **Fix**: Added `scrollToBottom()` calls in `displaySpecialContent()` method
- **Status**: ✅ RESOLVED

### ASCII Art Settings
- **Issue**: ASCII art configuration in settings wasn't working
- **Fix**: Settings functionality has been properly implemented and tested
- **Status**: ✅ RESOLVED

## Current Status 🎉

All major issues have been resolved! The terminal portfolio now features:
- ✅ Proper output rendering
- ✅ Smooth auto-scrolling
- ✅ Dynamic input line positioning
- ✅ Working GitHub Pages deployment
- ✅ Clean built code without development artifacts
- ✅ Proper certifications and awards display with card-based design
- ✅ Fully functional settings panel with ASCII art configuration
- ✅ Clean help menu without duplicates
- ✅ Subtle 3D mouse tracking animations
- ✅ Optimized terminal dimensions

The application is now fully functional and deployed at: **https://shenoyabhijith.github.io/resume** 