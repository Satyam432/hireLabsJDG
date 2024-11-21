import express from 'express';  // Use import instead of require
import bodyParser from 'body-parser';
import { generateJobDescription } from './claude.js'; // Import the function to interact with Claude AI

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// API endpoint to generate job description based on the input details
app.post('/generate-job-description', async (req, res) => {
    const { jobTitle, experienceLevel, industrySector, coreTechnicalSkills, workModel, companyName, companyDescription } = req.body;

    // Validate required fields
    if (!jobTitle || !experienceLevel || !industrySector || !coreTechnicalSkills || !workModel || !companyName || !companyDescription) {
        return res.status(400).json({ responseCode: 400, error: 'Missing required fields' });
    }

    try {
        // Call the generateJobDescription function
        const jobDescription = await generateJobDescription({
            jobTitle,
            experienceLevel,
            industrySector,
            coreTechnicalSkills,
            workModel,
            companyName,
            companyDescription
        });

        // Respond with the job description and success status code (200)
        res.status(200).json({ responseCode: 200, jobDescription });
    } catch (error) {
        if (error.message.includes('Claude API error')) {
            // If error is from Claude AI, return 403
            res.status(403).json({ responseCode: 403, error: 'Error from Claude AI' });
        } else {
            // If any other error occurs, return 500
            res.status(500).json({ responseCode: 500, error: 'Internal Server Error' });
        }
    }
});

// Start the server and bind to 0.0.0.0 to allow external requests
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
