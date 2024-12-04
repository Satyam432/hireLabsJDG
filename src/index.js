import express from 'express'; // Use import instead of require
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the CORS package
import { generateJobDescription } from './claude.js'; // Import the function to interact with Claude AI
import { getDynamoDBClient } from './dynamoService.js';
import { getS3Client } from './s3Service.js';

const app = express();
const port = 3000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

//AWS Config
// Configure AWS SDK with your S3 credentials and region
AWS.config.update({
    accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
    region: 'YOUR_AWS_REGION',
});

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

// API endpoint to fetch S3 pre-signed URL for resume upload
app.get('/get-upload-url', (req, res) => {
    const bucketName = 'user-resume-hirelabs';
    const uniqueId = nanoid();
    const key = `resumes/${uniqueId}.pdf`;

    // Get the S3 client
    const s3 = getS3Client();

    const params = {
        Bucket: bucketName,
        Key: key,
        Expires: 60, // URL validity in seconds
        ContentType: 'application/pdf',
    };

    try {
        const uploadUrl = s3.getSignedUrl('putObject', params);
        res.status(200).json({
            responseCode: 200,
            uploadUrl,
            uniqueId,
            key,
        });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).json({ responseCode: 500, error: 'Failed to generate upload URL' });
    }
});

// POST API to add user details to DynamoDB
app.post('/add-user', async (req, res) => {
    const { userId, firstName, lastName, s3SignedBucket, phoneNo, emailId, createdAt } = req.body;

    // Validate required fields
    if (!userId || !firstName || !lastName || !s3SignedBucket || !phoneNo || !emailId || !createdAt) {
        return res.status(400).json({ responseCode: 400, error: 'Missing required fields' });
    }

    try {
        // Get the DynamoDB client
        const dynamoDB = getDynamoDBClient();

        // Define parameters for the DynamoDB put operation
        const params = {
            TableName: 'userHireLabs',
            Item: {
                userId: { S: userId }, // Primary Key
                firstName: { S: firstName },
                lastName: { S: lastName },
                s3SignedBucket: { S: s3SignedBucket },
                phoneNo: { S: phoneNo },
                emailId: { S: emailId },
                createdAt: { S: createdAt },
            },
        };

        // Insert the data into DynamoDB
        await dynamoDB.putItem(params).promise();

        // Respond with success
        res.status(200).json({ responseCode: 200, message: 'User added successfully' });
    } catch (error) {
        console.error('Error adding user to DynamoDB:', error);
        res.status(500).json({ responseCode: 500, error: 'Internal Server Error' });
    }
});

// Start the server and bind to 0.0.0.0 to allow external requests
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
