# ElectroSage Academy

A comprehensive electrical education platform featuring AI-powered Socratic tutoring, 14 interactive visualizations, educational podcasts, voice-to-text learning, and professional circuit building tools. Master electrical engineering from fundamentals to advanced concepts.

## Features

### 🎓 Comprehensive Electrical Education
- **8 Progressive Sections**: From atomic structure to advanced electronic components
- **Professional Curriculum**: Structured learning path with mastery tracking
- **Interactive Content**: Rich educational content with embedded visualizations
- **Real-world Applications**: Practical knowledge for electrical engineering

### 🤖 AI-Powered Socratic Tutoring
- **ElectroSage AI**: Advanced AI tutor using Socratic questioning method
- **Personalized Learning**: Context-aware responses tailored to your progress
- **Guided Discovery**: Never gives direct answers - helps you discover solutions
- **Conversation History**: Maintains context across learning sessions
- **Voice-to-Text**: Powered by OpenAI Whisper for natural speech input

### 🔧 14 Interactive Visualizations
- **Circuit Builder**: Professional circuit construction with component library
- **Atomic Structure**: Interactive atomic models showing conductivity properties
- **AC Waveform Analysis**: Real-time frequency analysis and RMS calculations
- **Series/Parallel Circuits**: Current division and voltage drop demonstrations
- **Transformer Operation**: Interactive transformer voltage transformation
- **Capacitor/Inductor Effects**: Charging curves and magnetic field visualization
- **Safety Demonstrations**: Interactive electrical safety scenarios
- **Resistance Effects**: Heat generation and material property visualization

### 🎧 Educational Podcasts
- **8 Section-Based Episodes**: Professional podcast series covering each course section
- **Expert Insights**: In-depth discussions and real-world applications
- **iPhone Dynamic Island Player**: Minimalist audio player with track controls
- **Integrated Learning**: Podcasts complement visualizations and written content

### 🎤 Voice-to-Text Learning
- **OpenAI Whisper Integration**: High-accuracy speech-to-text transcription
- **Natural Voice Input**: Speak questions directly to the AI tutor
- **HTTPS Security**: Secure microphone access with permission management
- **Real-time Processing**: Live audio level feedback and instant transcription

### ♿ Accessibility Features
- **Keyboard Navigation**: Full keyboard support for all interactions
- **High Contrast Mode**: Enhanced visibility for users with visual impairments
- **Reduced Motion**: Respects user preferences for motion sensitivity
- **Focus Management**: Clear focus indicators and logical tab order
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Voice Input**: Speech-to-text for hands-free interaction

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd electrosage-academy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:4100](http://localhost:4100)

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: AI model to use (default: gpt-4)
- `OPENAI_MAX_TOKENS`: Maximum tokens per response (default: 1000)
- `OPENAI_TEMPERATURE`: AI response creativity (default: 0.7)
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_VERSION`: Application version

### Deployment Platforms
This app can be deployed on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## Usage Guide

### Navigation
- Use the sidebar to navigate between sections
- Progress is automatically tracked
- Settings panel (⚙️) for accessibility options

### ElectroSage AI Tutor
- Click the chat icon to open the AI tutor
- Experience Socratic method teaching - no direct answers!
- Get guided discovery through electrical concepts
- Ask questions about any section for personalized help
- Use voice input by clicking the microphone button (requires HTTPS or localhost)
- Speak naturally - Whisper AI converts speech to text

### Interactive Visualizations
- 14 advanced visualizations available across all sections
- Circuit Builder: Professional drag-and-drop circuit construction
- Atomic Structure: Explore elements and their conductivity properties
- AC Waveform: Real-time frequency analysis and oscilloscope simulation
- Transformer Demo: Interactive voltage transformation visualization
- Safety Scenarios: Interactive electrical safety training

### Educational Podcasts
- 8 professional podcast episodes, one for each course section
- Access via the iPhone Dynamic Island-style player in the top navigation
- Auto-minimize functionality with smooth playback transitions
- Full track controls with next/previous and episode selection dropdown

### Accessibility
- Press `Ctrl/Cmd + A` to open accessibility panel
- Use Tab/Shift+Tab for keyboard navigation
- Enable high contrast or reduced motion as needed
- Voice input available for hands-free interaction
- Full screen reader support with ARIA labels

## Technical Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Context**: State management

### Visualizations
- **D3.js**: Data visualization library
- **Three.js**: 3D graphics for atomic models
- **Canvas API**: Interactive circuit builder

### Backend
- **Next.js API Routes**: Server-side functionality
- **OpenAI API**: AI tutoring integration with GPT-4
- **OpenAI Whisper**: Speech-to-text transcription
- **Markdown Processing**: Content rendering with math support

### Key Components
- `ContentContext`: Manages learning content and navigation
- `ProgressContext`: Tracks user progress and achievements
- `AccessibilityContext`: Handles accessibility preferences
- `PodcastContext`: Manages podcast player state and episodes
- `TourContext`: Handles interactive onboarding tour system
- `ChatInterface`: AI tutor integration with voice input
- `SpeechRecorder`: Voice-to-text component using OpenAI Whisper
- `PodcastPlayer`: iPhone Dynamic Island-style audio player
- `VisualizationContainer`: Interactive learning tools

## Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── contexts/           # React Context providers
├── data/              # Static data and types
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── styles/            # Global styles
```

### Scripts
- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For questions or issues, please open a GitHub issue or contact the development team.
