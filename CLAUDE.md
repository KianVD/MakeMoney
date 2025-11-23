# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Academic Study Guide Generator - A React + TypeScript web application that transforms academic documents into structured study guides with AI-generated infographics. The app uses fal.ai exclusively for both content processing (via LLM) and visual infographic generation.

## Core Architecture

### Application Flow

1. User provides input via text or file upload (supports text files and images)
2. Content is sent to fal.ai's LLM with specialized infographic prompt (`src/services/falAiService.ts`)
   - Text input/files: Sent as string content to Llama 3.2 90B Vision model
   - Image files: Uploaded to fal.ai storage, then URL sent to Llama 3.2 90B Vision model for visual analysis
3. fal.ai LLM extracts key concepts and generates structured JSON with detailed infographic prompt
4. The infographic prompt is sent to fal.ai's Nano Banana Pro model for image generation
5. App displays generated infographic, formatted study guide, and raw JSON preview

### Key Components Structure
- `src/App.tsx` - Main application with input mode switching (text/file), state management, dark mode, and layout
- `src/components/TextInput.tsx` - Text area input component
- `src/components/FileUpload.tsx` - Drag-and-drop file upload (currently only .txt files work)
- `src/components/InfographicDisplay.tsx` - Displays AI-generated infographic image with download button
- `src/components/StudyGuideDisplay.tsx` - Renders generated study guide in a formatted view
- `src/components/JsonPreview.tsx` - Shows raw JSON output for reference

### Data Flow
- `src/types/studyGuide.ts` defines the StudyGuide interface which matches the required Daisy API format
- All generated content must conform to this structure with fields: title, summary, student_benefit_focus, sections[], infographic_style
- Sections contain: header, bullet_points[], visual_suggestions[], reminder_tips[]

### Services

**fal.ai Service (`src/services/falAiService.ts`)**
- `uploadImageToFal(file)` - Uploads image files to fal.ai storage and returns URL
- `processContentWithLLM(content)` - Sends content to fal.ai's vision-capable LLM (Llama 3.2 90B Vision) with specialized prompt for infographic generation
- Returns structured JSON with key concepts, visual style, and detailed infographic prompt
- `generateInfographic(prompt)` - Calls fal.ai's Nano Banana Pro model to generate infographic image
- Uses landscape 16:9 aspect ratio for infographics
- `createInfographic(content)` - Orchestrates the full pipeline: fal.ai LLM → fal.ai image generation → StudyGuide format conversion
- Handles JSON parsing with markdown code block cleanup
- Converts LLM response format into app's StudyGuide interface

**Note:** The old `src/services/geminiService.ts` is no longer used and can be removed.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint TypeScript files
npm run lint

# Preview production build
npm run preview
```

## Configuration

### Environment Setup
1. Copy `.env.example` to `.env`
2. Add fal.ai API key:
   - `VITE_FAL_AI_KEY` - Get from: https://fal.ai/dashboard/keys
3. This is the only API key required - fal.ai handles both LLM processing and image generation

### Tech Stack
- React 18 with TypeScript
- Vite for bundling and dev server
- Tailwind CSS for styling (with dark mode support)
- ESLint for linting
- @fal-ai/serverless-client for both LLM processing and AI image generation

## Important Constraints

### File Processing
- **Supported**: Plain text files (`.txt`) and images (`.jpg`, `.jpeg`, `.png`, `.gif`)
- **Not yet supported**: PDF files - would require pdf.js or similar library
- Images are passed directly to fal.ai's LLM which can analyze visual content
- Text files are read and passed as strings to the LLM

### API Integration
- Uses fal.ai exclusively for both content processing and infographic generation
- Must output JSON matching StudyGuide type
- API responses are cleaned of markdown formatting before parsing
- Error handling provides user-friendly messages

### Academic Focus
- All generated content targets students and academic use cases
- Output style must be "clean, minimal, academic, step-by-step"
- Content should include visual suggestions for infographic creation
- Tone should be simple and helpful like a tutor

## Testing & Validation

When modifying services or study guide generation:
1. **fal.ai Service Testing:**
   - Verify fal.ai LLM returns structured JSON with all required fields
   - Check that `infographic_prompt` is detailed and descriptive
   - Ensure fal.ai generates valid image URLs

2. **Study Guide Generation:**
   - Verify JSON output matches StudyGuide interface exactly
   - Test with various academic content types (instructions, definitions, formulas, etc.)
   - Ensure visual_suggestions and reminder_tips are populated

3. **Error Handling:**
   - Test behavior with missing API keys
   - Check error messages are user-friendly

## LLM System Prompt

The system prompt in `src/services/falAiService.ts` guides fal.ai's LLM to extract educational content and format it for infographic generation. Key elements:
- Extracts 3-5 key concepts with visual metaphors
- Generates detailed infographic prompts for AI image generation
- Specifies visual style (color scheme, layout, mood)
- Focuses on educational clarity and visual-friendly formatting
