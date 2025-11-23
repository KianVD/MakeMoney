# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Academic Study Guide Generator - A React + TypeScript web application that transforms academic documents into structured study guides with AI-generated infographics. The app uses fal.ai exclusively for both content processing (via LLM) and visual infographic generation.

## Core Architecture

### Application Flow

1. User provides input via text or file upload (supports text files and images)
2. Content is routed to the appropriate fal.ai workflow (`src/services/falAiService.ts`):
   - **Text input/files**: Processed through `workflows/DarenShamoun/text-mm` workflow
   - **Image files**: Uploaded to fal.ai storage first, then URL sent to `workflows/DarenShamoun/teammm` workflow
3. Workflow processes content and generates both:
   - Study guide data (title, sections, bullet points, tips)
   - Infographic image URL
4. App displays generated infographic, formatted study guide, and raw JSON preview

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
- `processTextWorkflow(text)` - Streams text through `workflows/DarenShamoun/text-mm` workflow
- `processImageWorkflow(imageUrl)` - Streams image URL through `workflows/DarenShamoun/teammm` workflow
- `createInfographic(content)` - Main orchestration function that:
  - Routes to text or image workflow based on content type
  - Uploads images to fal.ai storage when needed
  - Streams workflow events and logs progress
  - Extracts study guide data and infographic URL from workflow result
  - Converts workflow output to app's StudyGuide interface format

**Workflow Integration:**
- Uses `fal.stream()` API for real-time progress updates
- Workflows are custom-built on fal.ai platform
- Each workflow handles the complete pipeline (LLM processing + image generation)

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
- @fal-ai/client for workflow streaming API
- @fal-ai/serverless-client for storage API

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
1. **Workflow Testing:**
   - Test text workflow with sample educational content
   - Test image workflow with educational images (diagrams, notes, etc.)
   - Verify both workflows return infographic URL and study guide data
   - Check console logs for streaming events

2. **Study Guide Generation:**
   - Verify JSON output matches StudyGuide interface exactly
   - Test with various academic content types (instructions, definitions, formulas, etc.)
   - Ensure visual_suggestions and reminder_tips are populated

3. **Error Handling:**
   - Test behavior with missing API keys
   - Test with invalid image formats
   - Check error messages are user-friendly

## Workflow Output Format

The fal.ai workflows should return an object with:
- `infographic_url` or `image_url` or `output_url` - URL to the generated infographic
- Study guide data fields matching the StudyGuide interface:
  - `title` - Title of the content
  - `summary` - Brief summary
  - `sections[]` - Array of sections with:
    - `header` - Section title
    - `bullet_points[]` - Key points
    - `visual_suggestions[]` - Visual elements
    - `reminder_tips[]` - Memory aids

The service includes fallback field mappings to handle variations in workflow output structure.
