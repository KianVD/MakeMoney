import * as fal from "@fal-ai/serverless-client";
import { StudyGuide } from '../types/studyGuide';

// Configure fal.ai client
fal.config({
  credentials: import.meta.env.VITE_FAL_AI_KEY,
});

const INFOGRAPHIC_SYSTEM_PROMPT = `You are an AI assistant that converts educational content into structured JSON for infographic generation.

TASK: Extract the main ideas from the provided content and format them for visual infographic creation.

OUTPUT FORMAT (JSON only, no markdown):
{
  "title": "Clear, concise title for the infographic",
  "main_theme": "Central theme or topic in 2-3 words",
  "key_concepts": [
    {
      "concept": "Main idea or concept name",
      "description": "Brief 1-2 sentence explanation",
      "visual_metaphor": "Visual element that represents this concept",
      "importance": "high/medium/low"
    }
  ],
  "visual_style": {
    "color_scheme": "Suggested color palette (e.g., 'blue and green for trust', 'warm oranges for energy')",
    "layout": "Suggested layout type (e.g., 'circular flow', 'hierarchical tree', 'timeline', 'mind map')",
    "icons_needed": ["list", "of", "relevant", "icons"],
    "mood": "professional/playful/academic/modern"
  },
  "infographic_prompt": "A detailed prompt for image generation that describes the complete infographic with all elements positioned and styled",
  "sections": [
    {
      "section_title": "Section name",
      "content_points": ["Point 1", "Point 2"],
      "visual_weight": "Percentage of infographic space (e.g., '25%')"
    }
  ]
}

RULES:
1. Extract only the most important 3-5 key concepts
2. Keep descriptions concise and visual-friendly
3. The infographic_prompt should be detailed enough for an AI image generator
4. Ensure all content is factual and educational
5. Visual metaphors should be simple and universally understood
6. Return ONLY valid JSON, no additional text`;

interface ContentExtractionResponse {
  title: string;
  main_theme: string;
  key_concepts: Array<{
    concept: string;
    description: string;
    visual_metaphor: string;
    importance: string;
  }>;
  visual_style: {
    color_scheme: string;
    layout: string;
    icons_needed: string[];
    mood: string;
  };
  infographic_prompt: string;
  sections: Array<{
    section_title: string;
    content_points: string[];
    visual_weight: string;
  }>;
}

// Helper function to upload image to fal.ai storage
async function uploadImageToFal(file: File): Promise<string> {
  try {
    const url = await fal.storage.upload(file);
    return url;
  } catch (error) {
    console.error('Failed to upload image to fal.ai storage:', error);
    throw new Error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function processContentWithLLM(content: string | File): Promise<ContentExtractionResponse> {
  const apiKey = import.meta.env.VITE_FAL_AI_KEY;

  if (!apiKey) {
    throw new Error('fal.ai API key is not configured. Please set VITE_FAL_AI_KEY in your .env file.');
  }

  try {
    let prompt: string;
    let imageUrl: string | undefined;

    // Handle both text and image inputs
    if (typeof content === 'string') {
      prompt = `${INFOGRAPHIC_SYSTEM_PROMPT}\n\nUser content to process:\n${content}`;
    } else {
      // It's a File (image) - upload to fal.ai storage first
      console.log('Uploading image to fal.ai storage...');
      imageUrl = await uploadImageToFal(content);
      console.log('Image uploaded:', imageUrl);
      prompt = `${INFOGRAPHIC_SYSTEM_PROMPT}\n\nAnalyze the image provided and extract the educational content from it.`;
    }

    // Use fal.ai's vision-capable LLM to process the content
    const modelInput: any = {
      model: "meta-llama/llama-3.2-90b-vision-instruct",
      prompt: prompt,
      max_tokens: 2000,
      temperature: 0.7,
    };

    // Add image_url only if we have an image
    if (imageUrl) {
      modelInput.image_url = imageUrl;
    }

    const result = await fal.subscribe("fal-ai/any-llm", {
      input: modelInput,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log('Processing content with LLM...', update.logs);
        }
      },
    });

    const responseText = result.output;

    if (!responseText) {
      throw new Error('No response text from fal.ai LLM');
    }

    // Clean the response text - remove markdown code blocks if present
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('fal.ai LLM processing error:', error);
    throw new Error('Failed to process content with LLM: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function generateInfographic(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_FAL_AI_KEY;

  if (!apiKey) {
    throw new Error('fal.ai API key is not configured. Please set VITE_FAL_AI_KEY in your .env file.');
  }

  try {
    const result = await fal.subscribe("fal-ai/nano-bana-pro", {
      input: {
        prompt: prompt,
        image_size: "landscape_16_9",
        num_images: 1,
        enable_safety_checker: true,
        seed: Math.floor(Math.random() * 1000000)
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log('Generating infographic...', update.logs);
        }
      },
    });

    // Return the image URL
    if (result.images && result.images.length > 0) {
      return result.images[0].url;
    } else {
      throw new Error('No images generated by fal.ai');
    }
  } catch (error) {
    console.error('Fal.ai generation error:', error);
    throw new Error('Failed to generate infographic: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function createInfographic(content: string | File): Promise<{
  studyGuide: StudyGuide;
  infographicUrl: string;
}> {
  // Step 1: Process with fal.ai LLM (handles both text and images)
  const structuredData = await processContentWithLLM(content);

  // Step 2: Generate the infographic with fal.ai
  const infographicUrl = await generateInfographic(structuredData.infographic_prompt);

  // Step 3: Convert to your existing study guide format
  const studyGuide: StudyGuide = {
    title: structuredData.title,
    summary: `Infographic about ${structuredData.main_theme}`,
    student_benefit_focus: "Making academic life smoother through simplified study tools, reminders, and tutoring-style explanations.",
    sections: structuredData.sections.map(section => ({
      header: section.section_title,
      bullet_points: section.content_points,
      visual_suggestions: [
        ...structuredData.key_concepts
          .filter(c => c.importance === 'high')
          .map(c => c.visual_metaphor),
        `Layout: ${structuredData.visual_style.layout}`,
        `Color scheme: ${structuredData.visual_style.color_scheme}`
      ],
      reminder_tips: structuredData.key_concepts
        .map(c => `Remember: ${c.concept} - ${c.description}`)
    })),
    infographic_style: `${structuredData.visual_style.mood}, ${structuredData.visual_style.layout}`
  };

  return {
    studyGuide,
    infographicUrl
  };
}
