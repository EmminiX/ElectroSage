
## Project Overview

We're building an interactive educational web application for teaching electricity concepts with:
1. Split-screen layout: Content on left, AI chat interface on right
2. Interactive visualizations for electrical concepts
3. AI-powered tutoring capabilities
4. Modern, responsive design

## Using Warp Agent Mode

### Getting Started

1. **Launch Warp** and navigate to your project directory:
   ```bash
   cd /Users/emmi/Projects/Basic_electricity_tutor
   ```

2. **Activate Agent Mode**:
   - Press `Option + A` (Mac) to toggle Agent Mode
   - Or type `/agent` to activate

3. **Set Project Context**:
   - Ask the agent to read your project files:
   ```
   Read the INSTRUCTIONS.md, PROJECT_RULES.md, and CLAUDE.md files to understand the project requirements
   ```

### Project Initialization Prompts

Use these prompts to start your project:

1. **Project Setup**:
   ```
   Create a new Next.js project with TypeScript for our Basic Electricity Tutor application. 
   Use the app router, set up Tailwind CSS, and organize the project structure as defined in INSTRUCTIONS.md
   ```

2. **Split-Screen Layout**:
   ```
   Create the main layout component that implements the split-screen design with educational content 
   on the left and an AI chat interface on the right. Make it responsive for both desktop and tablet.
   ```

3. **Content Parser**:
   ```
   Create a utility to parse the Basic_Electricity_Tutor_Content.md file into a structured JSON format 
   that we can use for dynamic content rendering. Keep the visual aid instructions as metadata.
   ```

### Implementing Key Features

Use these prompts for implementing core features:

1. **Interactive Circuit Visualization**:
   ```
   Create a D3.js component that visualizes series vs parallel circuits with interactive current flow. 
   Allow users to adjust resistance values and see how it affects the circuit.
   ```

2. **3D Component Visualizations**:
   ```
   Implement a Three.js component that shows a 3D model of a capacitor with charging and discharging 
   animation. Include electric field visualization.
   ```

3. **AI Chatbot Integration**:
   ```
   Create an AI chat interface component that can communicate with the OpenAI API. 
   Design the component to send context about the current section being viewed.
   ```

4. **Content Navigator**:
   ```
   Build a navigation component that parses the headings from our content and creates 
   a hierarchical, collapsible navigation menu.
   ```

### Iterative Development

For ongoing development, use these multi-step prompts:

1. **Adding New Visualizations**:
   ```
   Let's add a new interactive visualization for Ohm's Law. Create a component that shows 
   the relationship between voltage, current, and resistance with adjustable sliders.
   ```

2. **Enhancing AI Context**:
   ```
   Improve the AI chat component by adding context awareness. When a user is viewing specific 
   content, make sure the AI knows what section they're reading.
   ```

3. **Optimizing Visualizations**:
   ```
   Review and optimize the circuit visualization component. It's currently causing performance 
   issues on slower devices. Implement lazy loading and more efficient rendering.
   ```

### Testing & Debugging

For quality assurance:

1. **Component Testing**:
   ```
   Create Jest tests for our circuit visualization components. Focus on testing the calculations 
   and data transformations rather than visual rendering.
   ```

2. **End-to-End Testing**:
   ```
   Set up Cypress for end-to-end testing. Create a test that verifies users can navigate 
   through content and interact with the AI chatbot.
   ```

3. **Debugging Rendering Issues**:
   ```
   Help me debug why the transformer visualization isn't rendering properly on Firefox. 
   Here's the component code and the error message...
   ```

### Deployment

For deploying your application:

1. **Production Build**:
   ```
   Prepare the application for production deployment. Optimize the bundle size, 
   implement code splitting for the visualization libraries, and set up proper caching.
   ```

2. **Environment Configuration**:
   ```
   Set up environment variables for our production deployment. We need to secure the API keys 
   for OpenAI and configure the proper build settings for Vercel.
   ```

## Best Practices for Warp Agent

1. **Provide Clear Context**:
   - Show relevant files or error messages in your prompts
   - Reference specific requirements from the instruction files

2. **Use Multi-Turn Conversations**:
   - Start with a high-level task
   - Ask follow-up questions to refine the implementation
   - Use the agent's memory within a session

3. **Review Changes Carefully**:
   - Examine the diffs suggested by the agent
   - Request explanations for complex code
   - Test code before accepting changes

4. **Use Warp's Diff Review**:
   - Warp Agent shows changes as diffs
   - Accept, reject, or modify before applying
   - Ask for alternatives if needed

## Reference Architecture Prompts

Use these prompts to understand the overall architecture:

1. **Content Data Flow**:
   ```
   Explain the data flow from our markdown content to the rendered components 
   and how the AI chat system can access this content for context.
   ```

2. **Visualization Component Architecture**:
   ```
   Design a reusable architecture for all our visualization components that allows 
   for consistent styling, interaction patterns, and optimized performance.
   ```

3. **State Management Strategy**:
   ```
   Recommend a state management approach for our application. Consider the needs 
   of preserving user progress, chat history, and visualization states.
   ```

## Resources

- [Warp Agent Documentation](https://docs.warp.dev/agents/code)
- [Project-specific files](INSTRUCTIONS.md, PROJECT_RULES.md, CLAUDE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [D3.js Documentation](https://d3js.org/)
- [Three.js Documentation](https://threejs.org/docs/)
