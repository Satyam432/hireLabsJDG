import Anthropic from '@anthropic-ai/sdk'; // Import the Anthropic SDK
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Load environment variables from .env

// Initialize the Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY, // Ensure the environment variable is set
});

export async function generateJobDescription({
    jobTitle,
    experienceLevel,
    industrySector,
    coreTechnicalSkills,
    workModel,
    companyName,
    companyDescription,
}) {
    try {
        // Ensure coreTechnicalSkills is an array
        const skills = Array.isArray(coreTechnicalSkills)
            ? coreTechnicalSkills
            : typeof coreTechnicalSkills === 'string'
            ? coreTechnicalSkills.split(',').map(skill => skill.trim())
            : [];

        // Construct the prompt for Claude AI
        const prompt = `
        Generate a job description for the following role:
        
        Job Title: ${jobTitle}
        Experience Level: ${experienceLevel}
        Industry Sector: ${industrySector}
        Core Technical Skills: ${skills.join(', ')}
        Work Model: ${workModel}
        Company Name: ${companyName}
        Company Description: ${companyDescription}
        `;

        // Call the Anthropic API
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022", // Ensure this is a valid model
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });

        // Log the full response for debugging
        console.log("API Response:", JSON.stringify(response, null, 2));

        // Check if the response content exists
        if (!response || !response.content || response.content.length === 0) {
            throw new Error('Claude API error: No response content');
        }

        // Assuming the response content is structured as you mentioned, extract the text
        const jobDescription = response.content
            .map((item) => item.text)
            .join('\n'); // Combine all the text parts if there are multiple

        return jobDescription;
    } catch (error) {
        // Print detailed error information
        console.error('Error generating job description:', error.message);
        console.error('Stack trace:', error.stack);

        // In case of API error, log the full response if available
        if (error.response) {
            console.error('API Error Response:', JSON.stringify(error.response, null, 2));
        }

        throw error; // Re-throw the error after logging
    }
}
