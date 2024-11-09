import claudeAI from 'claude-ai';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Function to generate job description
export async function generateJobDescription({ jobTitle, experienceLevel, industrySector, coreTechnicalSkills, workModel, companyName, companyDescription }) {
    try {
        // Construct the prompt for Claude AI
        const prompt = `
        Generate a job description for the following role:

        Job Title: ${jobTitle}
        Experience Level: ${experienceLevel}
        Industry Sector: ${industrySector}
        Core Technical Skills: ${coreTechnicalSkills.join(', ')}
        Work Model: ${workModel}
        Company Name: ${companyName}
        Company Description: ${companyDescription}
        `;
        
        // Assuming the package uses a direct API function instead of `Client`
        const response = await claudeAI.generate({ 
            prompt, 
            apiKey: process.env.CLAUDE_API_KEY 
        });

        // Check for errors from Claude AI
        if (response.error) {
            throw new Error('Claude API error: ' + response.error.message); // Throw error if Claude returns one
        }

        // Return the generated job description text
        return response.text;
    } catch (error) {
        console.error('Error generating job description:', error);
        throw error; // Rethrow the error to be handled in index.js
    }
}
