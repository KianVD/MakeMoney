import { fal } from "@fal-ai/client";
import { StudyGuide } from '../types/studyGuide';

// Configure fal.ai client
fal.config({
  credentials: import.meta.env.VITE_FAL_AI_KEY,
});

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

// Process text using the text workflow
async function processTextWorkflow(text: string): Promise<any> {
  const apiKey = import.meta.env.VITE_FAL_AI_KEY;

  if (!apiKey) {
    throw new Error('fal.ai API key is not configured. Please set VITE_FAL_AI_KEY in your .env file.');
  }

  try {
    console.log('Starting text workflow...');

    const stream = await fal.stream("workflows/DarenShamoun/text-mm", {
      input: {
        text_field: text
      }
    });

    // Log events as they come in
    for await (const event of stream) {
      console.log('Text workflow event:', event);
    }

    // Get the final result
    const result = await stream.done();
    console.log('Text workflow complete:', result);

    return result;
  } catch (error) {
    console.error('Text workflow error:', error);
    throw new Error('Failed to process text workflow: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Process image using the image workflow
async function processImageWorkflow(imageUrl: string): Promise<any> {
  const apiKey = import.meta.env.VITE_FAL_AI_KEY;

  if (!apiKey) {
    throw new Error('fal.ai API key is not configured. Please set VITE_FAL_AI_KEY in your .env file.');
  }

  try {
    console.log('Starting image workflow with URL:', imageUrl);

    const stream = await fal.stream("workflows/DarenShamoun/teammm", {
      input: {
        image_url_field: imageUrl
      }
    });

    // Log events as they come in
    for await (const event of stream) {
      console.log('Image workflow event:', event);
    }

    // Get the final result
    const result = await stream.done();
    console.log('Image workflow complete:', result);

    return result;
  } catch (error) {
    console.error('Image workflow error:', error);
    throw new Error('Failed to process image workflow: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Main function to create infographic from text or image
export async function createInfographic(content: string | File): Promise<{
  studyGuide: StudyGuide;
  infographicUrl: string;
}> {
  let workflowResult: any;

  // Route to the correct workflow based on content type
  if (typeof content === 'string') {
    // Text workflow
    workflowResult = await processTextWorkflow(content);
  } else {
    // Image workflow - upload image first, then process
    console.log('Uploading image to fal.ai storage...');
    const imageUrl = await uploadImageToFal(content);
    console.log('Image uploaded:', imageUrl);

    workflowResult = await processImageWorkflow(imageUrl);
  }

  // Extract the infographic URL from workflow result
  // Workflow returns: { output: { images: [{ url: "..." }] } }
  const infographicUrl = workflowResult.output?.images?.[0]?.url;

  if (!infographicUrl) {
    console.error('Workflow result:', workflowResult);
    throw new Error('No infographic URL returned from workflow');
  }

  console.log('Infographic generated:', infographicUrl);

  // Since the workflow only returns an image, create a simple study guide
  // to display alongside the infographic
  const studyGuide: StudyGuide = {
    title: typeof content === 'string'
      ? (content.substring(0, 50) + (content.length > 50 ? '...' : ''))
      : 'Visual Study Guide',
    summary: 'AI-generated infographic from your content',
    student_benefit_focus: "Making academic life smoother through simplified study tools, reminders, and tutoring-style explanations.",
    sections: [{
      header: 'Study Guide',
      bullet_points: [
        'View the infographic above for a visual summary',
        'Download the image for offline study',
        'Use this as a quick reference guide'
      ],
      visual_suggestions: [
        'Infographic designed for easy comprehension',
        'Visual elements highlight key concepts'
      ],
      reminder_tips: [
        'Review the infographic regularly',
        'Share with study groups'
      ]
    }],
    infographic_style: "AI-generated visual study guide"
  };

  return {
    studyGuide,
    infographicUrl
  };
}
