# Health Management System - Server

## Gemini API Integration

This server now uses the Google Gemini API for the AI chatbot functionality. To use this feature, you need to:

1. Create a `.env` file in the server directory with the following content:
   ```
   JWT_SECRET=your-secret-key-here
   GEMINI_API_KEY=your-gemini-api-key-here
   PORT=5000
   ```

2. Replace `your-gemini-api-key-here` with your actual Gemini API key.

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in or create an account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key and paste it in your `.env` file

## Installing Dependencies

After updating the code, make sure to install the new dependencies:

```bash
npm install
```

## Starting the Server

```bash
npm start
```

## Features

- Enhanced AI chatbot using Google Gemini API
- Patient context is now included in AI responses for more personalized healthcare information
- Improved error handling and response formatting 