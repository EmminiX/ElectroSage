# Basic Electricity Tutor - Interactive Web Application

This CLAUDE.md file provides essential context for Claude Code when developing the Basic Electricity Tutor interactive web application.

> **Note for non-Claude agents**: If you are using a different AI coding assistant (Cursor, Windsurf, Cline, Warp, etc.), please refer to the `GENERAL_PROJECT_INSTRUCTIONS.md` file instead, which contains equivalent instructions formatted for general AI coding agents.

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

2. **Performance Requirements**

1. **Core Web Vitals**
   - Largest Contentful Paint (LCP): < 2.5s
   - First Input Delay (FID): < 100ms
   - Cumulative Layout Shift (CLS): < 0.1

2. **Optimization**
   - Code splitting for route-based loading
   - Image optimization with next/image
   - Server-side rendering for initial content
   - Client-side data fetching for dynamic content

3. **Error Tracking & Monitoring**
   - Implement comprehensive error tracking system
   - Log errors with contextual information (user actions, state)
   - Set up real-time error notifications
   - Create error boundaries for graceful component failure
   - Maintain detailed error recovery strategies
   - Use structured logging for easier debugging

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

## Key Visualization Requirements

The application needs interactive visualizations for:

1. **Circuit concepts**:
   - Series vs parallel circuits with current flow
   - Interactive Ohm's Law demonstrations
   - Voltage, current, and resistance relationships

2. **Component behavior**:
   - Capacitor charging/discharging
   - Inductor magnetic field formation
   - Transistor operation modes
   - Diode forward/reverse bias

3. **Advanced concepts**:
   - AC waveforms and power factor
   - 3-phase systems
   - Transformer operation
   - Power supply filtering

4. **Safety visualizations**:
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
