import AWS from 'aws-sdk'; // Import the AWS SDK

// Function to create and return an S3 client
export const getS3Client = () => {
    // Configure AWS with credentials and region
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Read Access Key ID from environment variables
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Read Secret Access Key from environment variables
        region: 'ap-south-1', // Set the region to Mumbai
    });

    // Return a new S3 client instance
    return new AWS.S3();
};
