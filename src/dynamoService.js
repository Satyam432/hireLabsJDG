export const getDynamoDBClient = () => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'ap-southeast-1',
    });

    return new AWS.DynamoDB.DocumentClient(); // Returns DocumentClient instead of DynamoDB
};
