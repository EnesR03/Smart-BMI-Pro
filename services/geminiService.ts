import { GoogleGenAI, Type } from "@google/genai";
import { UserMetrics, BMIResult, AIResponse } from "../types";

export const getHealthTips = async (metrics: UserMetrics, result: BMIResult): Promise<AIResponse> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === '') {
    throw new Error("API_KEY is missing. Please add it to your Vercel Environment Variables (Settings > Environment Variables).");
  }

  // Use the standard initialization pattern as per @google/genai guidelines
  const ai = new GoogleGenAI({ apiKey });
  
  const greeting = metrics.name ? `The user's name is ${metrics.name}.` : "The user has not provided a name.";
  
  const prompt = `
    ${greeting}
    The user has a BMI of ${result.bmi.toFixed(1)}, which falls into the "${result.category}" category.
    User Details:
    - Age: ${metrics.age || 'Not specified'}
    - Gender: ${metrics.gender || 'Not specified'}
    - Weight: ${metrics.weight} ${metrics.unitSystem === 'METRIC' ? 'kg' : 'lbs'}
    - Height: ${metrics.height} ${metrics.unitSystem === 'METRIC' ? 'cm' : 'inches'}

    Provide a summary of what this BMI means and 3 personalized wellness tips (1 for diet, 1 for exercise, 1 for lifestyle) based on this profile.
    If the name is provided, address them politely in the summary.
    Keep tips concise, encouraging, and actionable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  category: { type: Type.STRING, description: "One of: diet, exercise, lifestyle" }
                },
                required: ["title", "content", "category"]
              }
            }
          },
          required: ["summary", "tips"]
        }
      }
    });

    if (!response.text) {
      throw new Error("The AI returned an empty response.");
    }

    const data = JSON.parse(response.text);
    return data as AIResponse;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate health tips. Ensure your API key is valid and has billing enabled if required.");
  }
};