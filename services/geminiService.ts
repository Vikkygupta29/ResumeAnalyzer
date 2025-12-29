// services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "../types";

// ✅ Correct Vite syntax to access your .env variable
const API_KEY = import.meta.env.VITE_API_KEY; 

const genAI = new GoogleGenerativeAI(API_KEY || '');

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", 
  });

  const prompt = `
    Analyze the following Resume against the Job Description provided.
    
    Return ONLY a JSON object with this exact structure:
    {
      "matchScore": number,
      "matchingSkills": string[],
      "missingSkills": string[],
      "formattingFeedback": string[],
      "roleFit": string,
      "suggestedImprovements": [
        { "category": string, "action": string, "impact": string }
      ],
      "atsOptimization": string[]
    }

    Resume: ${resumeText}
    Job Description: ${jobDescription}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean markdown formatting if present
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze resume. Check your API key and connection.");
  }
};