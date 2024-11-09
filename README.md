# hireLabs Job Description Generator API

This API generates a job description based on the role details provided. The input is passed to Claude AI, which will generate a tailored job description.

## API Endpoints

### POST `/generate-job-description`

This endpoint takes the role details and requests Claude AI to generate a job description that fits the provided information.

#### Request Body

The request body should be a JSON object containing the following fields:

```json
{
  "jobTitle": "Software Engineer",
  "experienceLevel": "Mid-level",
  "industrySector": "Software Development",
  "coreTechnicalSkills": ["JavaScript", "Node.js", "AWS"],
  "workModel": "Remote",
  "companyName": "hireLabs",
  "companyDescription": "hireLabs is a tech company specializing in AI-driven HR solutions."
}


```json
{
  "responseCode": 200,
  "jobDescription": "We are looking for a Mid-level Software Engineer to join our team at hireLabs. The ideal candidate will have experience in JavaScript, Node.js, and AWS. As a Software Engineer at hireLabs, you will work remotely and contribute to AI-driven HR solutions."
}
