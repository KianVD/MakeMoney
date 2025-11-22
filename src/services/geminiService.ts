import { StudyGuide } from '../types/studyGuide';

// List of model endpoints to try in order (based on available models for your API key)
const MODEL_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:generateContent',
];

export async function generateStudyGuide(content: string): Promise<StudyGuide> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const prompt = `You are an AI tutor helping students create study guides. Transform the following academic content into a structured study guide.

Content to process:
${content}

Your task:
1. Extract the most useful academic information
2. Transform it into a structured study guide
3. Break down instructions into step-by-step form if applicable
4. Extract definitions, key ideas, formulas, timelines, or comparisons for academic content
5. Always include visual suggestions for infographic creation

Output ONLY valid JSON in this exact format (no markdown, no code blocks, just the JSON):
{
  "title": "Topic name here",
  "summary": "Brief explanation for studying",
  "student_benefit_focus": "Making academic life smoother through simplified study tools, reminders, and tutoring-style explanations.",
  "sections": [
    {
      "header": "Section or step name",
      "bullet_points": ["Key point 1", "Key point 2"],
      "visual_suggestions": ["What should be drawn", "Visual emphasis"],
      "reminder_tips": ["Memory cue", "Exam helper"]
    }
  ],
  "infographic_style": "clean, minimal, academic, step-by-step"
}

Keep the tone simple and helpful, like a tutor. Ensure all fields are filled with meaningful content.`;

  // Try each model endpoint until one works
  let lastError: Error | null = null;
  
  for (const endpoint of MODEL_ENDPOINTS) {
    try {
      const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `API request failed: ${response.statusText}`;
        
        // If model not found, try next model
        if (errorMessage.includes('not found') || errorMessage.includes('not supported')) {
          lastError = new Error(errorMessage);
          continue; // Try next model
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Extract text from Gemini response
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!responseText) {
        throw new Error('No response text from Gemini API');
      }

      // Clean the response text - remove markdown code blocks if present
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Parse JSON
      const studyGuide: StudyGuide = JSON.parse(cleanedText);

      // Validate structure
      if (!studyGuide.title || !studyGuide.sections || !Array.isArray(studyGuide.sections)) {
        throw new Error('Invalid study guide structure received from API');
      }

      return studyGuide;
    } catch (error) {
      // If it's a model error, try next model
      if (error instanceof Error && (error.message.includes('not found') || error.message.includes('not supported'))) {
        lastError = error;
        continue;
      }
      // If it's a JSON parsing error, don't try other models
      if (error instanceof SyntaxError) {
        throw new Error('Failed to parse JSON response from Gemini API. The API may have returned invalid JSON.');
      }
      throw error;
    }
  }
  
  // If we get here, all models failed
  throw new Error(
    `All model endpoints failed. Last error: ${lastError?.message || 'Unknown error'}\n\n` +
    `Please check your API key and ensure it has access to Gemini models. You can check available models at: ` +
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
}

