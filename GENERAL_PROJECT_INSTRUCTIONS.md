# Basic Electricity Tutor - Interactive Web Application

This file provides essential context for AI coding agents (Cursor, Windsurf, Cline, Warp, etc.) developing the Basic Electricity Tutor interactive web application.

## Project Context

This application transforms a comprehensive electricity education curriculum into an interactive web experience with:

1. Split-screen interface: Content on left, AI chatbot on right
2. Interactive visualizations for electrical concepts
3. AI-powered tutoring system specialized in electricity
4. Modern, responsive web design

## Development Goals

- Create engaging, interactive visualizations for abstract electrical concepts
- Implement an AI chat interface that provides contextually relevant assistance
- Ensure the application is performant and accessible
- Follow modern web development best practices

## Technical Requirements

### Stack
- Next.js 14+ with App Router
- React 18+
- TypeScript
- Tailwind CSS
- D3.js for data visualizations
- Three.js for 3D visualizations
- Circuit simulation library (CircuitJS or similar)
- OpenAI or Anthropic API for AI tutoring

### Project Structure

```
/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── page.tsx                  # Main entry point
│   │   ├── layout.tsx                # Root layout
│   │   ├── api/                      # API routes
│   │   │   ├── content/
│   │   │   │   └── route.ts          # Content parsing API
│   │   │   └── chat/
│   │   │       └── route.ts          # AI chat API
│   │   └── [...]/                    # Other app routes
│   ├── components/                   # Reusable UI components
│   │   ├── layout/                   # Layout components
│   │   │   ├── SplitScreen.tsx       # Split screen layout
│   │   │   ├── Header.tsx            # Header component
│   │   │   └── Footer.tsx            # Footer component
│   │   ├── ui/                       # Basic UI components
│   │   │   ├── Button.tsx            # Button component
│   │   │   ├── Input.tsx             # Input component
│   │   │   └── ...                   # Other UI components
│   │   ├── visualizations/           # Interactive visualization components
│   │   │   ├── circuits/             # Circuit visualizations
│   │   │   │   ├── SeriesCircuit.tsx # Series circuit visualization
│   │   │   │   └── ...               # Other circuit visualizations
│   │   │   ├── atoms/                # Atomic visualizations
│   │   │   │   └── ...               # Atomic structure visualizations
│   │   │   └── ...                   # Other visualization categories
│   │   └── ai/                       # AI chat components
│   │       ├── ChatInterface.tsx     # Chat UI component
│   │       ├── MessageBubble.tsx     # Message display component
│   │       └── ...                   # Other chat components
│   ├── lib/                          # Utility functions and libraries
│   │   ├── content/                  # Content handling utilities
│   │   │   ├── parser.ts             # Markdown parsing functions
│   │   │   └── ...                   # Other content utilities
│   │   ├── ai/                       # AI utilities
│   │   │   ├── prompts.ts            # System prompts
│   │   │   └── ...                   # Other AI utilities
│   │   └── ...                       # Other utility categories
│   ├── data/                         # Parsed content and data structures
│   │   ├── types.ts                  # TypeScript type definitions
│   │   └── ...                       # Data processing utilities
│   ├── hooks/                        # Custom React hooks
│   │   ├── useContent.ts             # Content loading hook
│   │   ├── useChat.ts                # Chat functionality hook
│   │   └── ...                       # Other custom hooks
│   └── styles/                       # Global styles
└── content/                          # Source content files
    └── Basic_Electricity_Tutor_Content.md  # Original content
```

## File Organization & Modularity Guidelines

### Modular Code Structure

This project requires a highly modular code structure to enhance accessibility and maintainability. Follow these guidelines:

1. **Small, Focused Files**
   - Keep each file under 100-150 lines of code when possible
   - Each file should have a single responsibility or purpose
   - Break larger components into smaller sub-components

2. **Component Organization**
   - One component per file
   - Name files exactly after the component they contain
   - Group related components in dedicated folders

3. **Logic Separation**
   - Extract business logic from UI components into custom hooks
   - Place utility functions in dedicated files in the `lib` directory
   - Separate data processing from rendering logic

4. **Visualization Modularity**
   - Each visualization type should be in its own file
   - Break complex visualizations into smaller, composable parts
   - Extract reusable visualization elements into shared components

5. **Import Strategy**
   - Use explicit imports rather than wildcard imports
   - Import only what's needed from each module
   - Consider using barrel exports (index.ts files) for related components

This modular approach reduces cognitive load, improves code navigation, and makes the codebase more accessible for developers with dyslexia or ADHD while also helping AI coding agents understand and modify the code more effectively.

## Development Guidelines

1. **Code Quality**
   - Follow TypeScript best practices
   - Use ESLint and Prettier
   - Write unit tests for core functionality
   - Use component-driven development approach

2. **Performance**
   - Optimize all visualizations
   - Implement efficient state management
   - Use code splitting for large libraries
   - Lazy load non-critical components

3. **Accessibility**
   - Follow WCAG 2.1 AA standards
   - Ensure keyboard navigation
   - Provide text alternatives for visuals
   - Maintain proper semantic structure

4. **AI Integration**
   - Implement proper context handling
   - Design fallbacks for API limitations
   - Create specialized electricity teaching prompt
   - Implement client-side rate limiting

5. **Error Tracking & Monitoring**
   - Implement comprehensive error tracking system
   - Log errors with contextual information
   - Set up real-time error notifications
   - Create error boundaries for component failures
   - Maintain detailed error recovery strategies

## Design & Accessibility Requirements

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

2. **Focus Management**:
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

## Key Visualization Requirements

The application needs interactive visualizations for:

1. **Circuit concepts**:
   - Series vs parallel circuits with current flow
   - Interactive Ohm's Law demonstrations
   - Voltage, current, and resistance relationships

2. **Component Behavior**:
   - Capacitor charging/discharging
   - Inductor magnetic field formation
   - Transistor operation modes
   - Diode forward/reverse bias

3. **Advanced Concepts**:
   - AC waveforms and power factor
   - 3-phase systems
   - Transformer operation
   - Power supply filtering

4. **Safety Visualizations**:
   - Electric shock pathways through body
   - Proper measurement techniques
   - Grounding and protection systems

## Next Steps

1. Set up the Next.js project with TypeScript
2. Implement the basic split-screen layout
3. Create a content parser for the Markdown file
4. Build the initial visualization components
5. Set up the AI chat interface

## Reference

- Original content is in `Basic_Electricity_Tutor_Content.md`

## External Resources

When developing this project, always utilize these resources for up-to-date information:

1. **Context7 MCP Server** - Use this to retrieve current documentation for any libraries or frameworks used in the project (Next.js, React, D3.js, Three.js, etc.)

2. **Websearch MCP** - Perform web searches for the latest information on electrical concepts, visualization techniques, and best practices

3. **Firecrawl** - Use this for in-depth research on specific technical topics related to the project

These resources should be consulted regularly during development to ensure the implementation follows current best practices and uses the most effective approaches for educational visualizations.

### Progress Tracking System

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

## Implementation Phases

### Phase 1: Setup & Content Structuring
1. Initialize Next.js project with TypeScript
2. Set up the basic split-screen layout
3. Parse Markdown content into structured format
4. Implement basic navigation and content display

### Phase 2: Visualization Components
1. Develop core visualization components for:
   - Circuit diagrams
   - Atomic structures
   - Current flow animations
   - Interactive measurement tools
   - Component behavior models
   - Waveform displays

2. Create interactive elements for each section based on visual aid instructions

### Phase 3: AI Chatbot Integration
1. Set up API connections to chosen AI provider
2. Design and test specialized system prompts
3. Implement chat interface with proper context passing
4. Add session management and history

### Phase 4: Integration & Refinement
1. Connect content with appropriate visualizations
2. Ensure the AI chatbot can reference and explain visualizations
3. Implement user progress tracking
4. Add final polish to UI/UX
5. Optimize for performance

## Performance Requirements

### Core Web Vitals
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Achieve Lighthouse score >90 for Performance

### Optimization Strategies
- Lazy load all visualization libraries
- Implement proper code splitting
- Bundle size < 500KB (main bundle)
- Optimize all images and assets
- Use efficient state management
- Implement proper caching strategies

### Accessibility Performance
- Screen reader response time < 200ms
- Keyboard navigation lag < 50ms
- Focus indicator visibility within 100ms
- Respect prefers-reduced-motion media query

## Development Guidelines for AI Coding Agents

This section provides guidance for AI coding agents (Cursor, Windsurf, Cline, Warp, etc.) working on this project.

2. **Key Files to Review**:
   - `Basic_Electricity_Tutor_Content.md`: Original educational content
   - `system_prompt_electricity_tutor.md`: AI tutor system prompt
   - `src/app/api/content/route.ts`: Content parsing API
   - `src/components/layout/SplitScreenLayout.tsx`: Main layout component

### Important Note on Content Parsing

When working with the content parser in `/src/app/api/content/route.ts`, be aware of the following:

- The content is parsed from markdown sections starting with H2 headings (## )
- A simpler split-based approach using `content.split(/^## /gm)` is used instead of complex regex
- This approach properly captures all 11 sections with substantial HTML content
- Each section's content is available for the AI chatbot to reference

This note is particularly important as there was a previous issue with content visibility that was resolved by modifying the parsing approach.

> **Note for Claude Code users**: If you are using Claude Code, please refer to the dedicated `CLAUDE.md` file which contains equivalent instructions formatted specifically for Claude Code.

This document serves as the primary reference for AI coding agents working on the Basic Electricity Tutor project.