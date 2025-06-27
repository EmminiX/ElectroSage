# Basic Electricity Tutor - Design & Accessibility Requirements

## Design Inspiration

Based on the user's Linux learning platform at https://linux.emmi.zone, the Basic Electricity Tutor should feature:

- Clean, modern dark theme with high contrast
- Split-screen layout: educational content (left) and AI chat interface (right)
- Collapsible navigation sidebar with hierarchical content structure
- Visual progress tracking system
- Accessibility controls panel
- Responsive design for desktop and tablet

## Accessibility Requirements (WCAG 2.1 AA+ Compliance)

### Typography & Font Accessibility

1. **Default Font**: LEXEND (primary choice for improved reading proficiency)
   - LEXEND reduces visual stress and improves reading speed by up to 25%
   - Implement as variable font for fine-tuned control over weight, width, and spacing
   - Fallback fonts: Inter, system-ui, sans-serif

2. **Dyslexia-Friendly Font Options**:
   - OpenDyslexic: Weighted bottom design prevents letter flipping
   - Dyslexie: Specifically designed for dyslexic readers
   - Atkinson Hyperlegible: High contrast letterforms

3. **Font Size Controls**:
   - Default: 16px base font size
   - Options: Small (14px), Normal (16px), Large (18px), Extra Large (20px)
   - Maintain proportional scaling for headings and UI elements
   - Persist user preferences in localStorage

### Visual Accessibility Features

1. **Color & Contrast**:
   - Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
   - High contrast mode option (7:1+ ratio)
   - Color-blind friendly palette with pattern/texture alternatives
   - Never rely solely on color to convey information

2. **Display Options Panel** (similar to linux.emmi.zone):
   ```
   Display Options:
   ☐ High Contrast Mode
   ○ Normal Text (default)
   ○ Large Text (120%)
   ○ Extra Large Text (140%)
   
   Reading Support:
   ☑ Dyslexia-Friendly Font
   ☑ Focus Mode
   ☐ Calm Mode (Reduce Animations)
   
   Matrix Background:
   ☑ Matrix Background
   Opacity: [slider] 50%
   Speed: [slider] 50%
   ```

3. **Focus Management**:
   - Visible focus indicators for all interactive elements
   - Logical tab order throughout the application
   - Skip navigation links
   - Focus mode to reduce distractions

### Interactive Elements & Navigation

1. **Keyboard Navigation**:
   - All functionality accessible via keyboard
   - Custom keyboard shortcuts for common actions
   - Arrow key navigation for content sections
   - Escape key to close modals/panels

2. **Screen Reader Support**:
   - Semantic HTML structure with proper headings (h1-h6)
   - ARIA labels and descriptions for complex visualizations
   - Live regions for dynamic content updates
   - Alternative text for all images and visualizations

3. **Motor Accessibility**:
   - Minimum touch target size: 44x44px
   - Generous spacing between interactive elements
   - Drag and drop alternatives for circuit building
   - Voice control compatibility

## Progress Tracking System

### Visual Progress Indicators

1. **Section Progress**:
   - Progress bar for each major section (0-100%)
   - Visual completion checkmarks
   - Time spent tracking
   - Mastery level indicators (Beginner, Intermediate, Advanced)

2. **Overall Progress Dashboard**:
   - Circular progress indicator showing overall completion
   - Section-by-section breakdown
   - Achievement badges for milestones
   - Learning streak counter

3. **Interactive Elements**:
   - Quiz completion status
   - Visualization interaction tracking
   - AI chat engagement metrics
   - Bookmark/favorite system

### Data Persistence

- Local storage for offline capability
- Optional cloud sync for cross-device progress
- Export progress reports (PDF/JSON)
- Reset progress functionality

## Visual Learning Enhancements

### Interactive Visualizations

1. **Circuit Simulations**:
   - Real-time current flow animations
   - Interactive component manipulation
   - Parameter adjustment sliders
   - Multi-step guided tutorials

2. **3D Models**:
   - Atomic structure visualizations
   - Component cross-sections
   - Electromagnetic field representations
   - Rotatable, zoomable models

3. **Data Visualizations**:
   - Interactive graphs and charts
   - Animated transitions between states
   - Hover tooltips with detailed information
   - Exportable visualizations

### Gamification Elements

1. **Achievement System**:
   - Progress badges for section completion
   - Mastery certificates
   - Learning streaks
   - Knowledge milestones

2. **Interactive Challenges**:
   - Circuit building challenges
   - Troubleshooting scenarios
   - Timed quizzes with immediate feedback
   - Collaborative problem-solving

## Modern UI/UX Patterns (2025)

### Design System

1. **Color Palette**:
   - Primary: Electric blue (#0066FF)
   - Secondary: Copper orange (#FF6B35)
   - Accent: Lightning yellow (#FFD700)
   - Neutral: Dark grays with blue undertones
   - Success: Electric green (#00FF88)
   - Warning: Amber (#FFA500)
   - Error: Red (#FF4444)

2. **Component Library**:
   - Consistent button styles with hover/focus states
   - Card-based content layout
   - Collapsible sections with smooth animations
   - Modal dialogs with proper focus management
   - Toast notifications for feedback

3. **Layout Patterns**:
   - Bento box layout for dashboard sections
   - Sticky navigation and progress indicators
   - Responsive grid system
   - Flexible sidebar with collapse functionality

### Animation & Micro-interactions

1. **Performance-Optimized Animations**:
   - CSS transforms and opacity changes only
   - Reduced motion respect (prefers-reduced-motion)
   - 60fps smooth animations
   - Meaningful motion that aids understanding

2. **Feedback Systems**:
   - Immediate visual feedback for interactions
   - Loading states for async operations
   - Success/error state animations
   - Progressive disclosure patterns

## Implementation Tools & Frameworks

### Accessibility Testing Tools

1. **Automated Testing**:
   - Axe DevTools integration
   - Pa11y CI for continuous testing
   - WAVE browser extension
   - Lighthouse accessibility audits

2. **Manual Testing**:
   - Screen reader testing (NVDA, JAWS, VoiceOver)
   - Keyboard-only navigation testing
   - Color contrast analyzers
   - Focus management verification

### Development Libraries

1. **Accessibility Libraries**:
   - @radix-ui/react-* for accessible primitives
   - react-aria for ARIA patterns
   - focus-trap-react for modal focus management
   - react-helmet-async for dynamic head management

2. **Animation Libraries**:
   - Framer Motion for complex animations
   - React Spring for physics-based animations
   - Lottie React for micro-animations
   - CSS-in-JS with emotion or styled-components

3. **Visualization Libraries**:
   - D3.js for data visualizations
   - Three.js for 3D graphics
   - React Three Fiber for React integration
   - Recharts for accessible charts

## Testing & Validation

### Accessibility Compliance

1. **WCAG 2.1 AA Checklist**:
   - Perceivable: Alt text, captions, color contrast
   - Operable: Keyboard navigation, no seizure triggers
   - Understandable: Clear language, consistent navigation
   - Robust: Valid HTML, assistive technology compatibility

2. **User Testing**:
   - Testing with users who have disabilities
   - Cognitive load assessment
   - Task completion rate analysis
   - Satisfaction surveys

### Performance Standards

1. **Core Web Vitals**:
   - Largest Contentful Paint (LCP) < 2.5s
   - First Input Delay (FID) < 100ms
   - Cumulative Layout Shift (CLS) < 0.1

2. **Accessibility Performance**:
   - Screen reader response time < 200ms
   - Keyboard navigation lag < 50ms
   - Focus indicator visibility within 100ms

This comprehensive design and accessibility specification ensures the Basic Electricity Tutor will be inclusive, visually engaging, and educationally effective for all learners.
