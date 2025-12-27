
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeResume = async (resume: string, jobDescription: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    Analyze the following Resume against the Job Description. 
    Provide a detailed match score (0-100), identify matching skills, missing critical skills, formatting feedback, ATS optimization tips, and specific suggested improvements.
    
    Resume:
    ${resume}
    
    Job Description:
    ${jobDescription}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchScore: { type: Type.NUMBER, description: "A score from 0 to 100 based on how well the resume matches the JD." },
          matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills present in both resume and JD." },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords or skills from the JD missing in the resume." },
          formattingFeedback: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tips on resume structure, length, or readability." },
          roleFit: { type: Type.STRING, description: "A brief summary of why the candidate is or isn't a good fit." },
          suggestedImprovements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                action: { type: Type.STRING },
                impact: { type: Type.STRING }
              },
              required: ["category", "action", "impact"]
            }
          },
          atsOptimization: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific changes to make the resume more machine-readable." }
        },
        required: ["matchScore", "matchingSkills", "missingSkills", "formattingFeedback", "roleFit", "suggestedImprovements", "atsOptimization"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text);
    return result as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid response format from AI");
  }
};
