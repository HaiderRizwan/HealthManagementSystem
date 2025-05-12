import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, CircularProgress, Typography, Box, Chip, Divider } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from "framer-motion";
import { buildApiUrl } from '../../../config/api';

export default function AiChatbot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [patientData, setPatientData] = useState(null);

  // Get user ID from local storage when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token and decode it to extract user ID
        const token = localStorage.getItem('token');
        if (token) {
          // Simple JWT decoding (not secure, just for display purposes)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decodedToken = JSON.parse(jsonPayload);
          setUserId(decodedToken.userId);
          
          // If user is a patient, fetch patient data
          if (decodedToken.role === 'Patient' || decodedToken.role === 'patient') {
            const userResponse = await axios.get(buildApiUrl(`/api/users/${decodedToken.userId}`));
            if (userResponse.data && userResponse.data.user) {
              setPatientData(userResponse.data.user);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(""); // Clear previous response

    try {
      if (!prompt.trim()) {
        setResponse("Please enter a question.");
        setLoading(false);
        return;
      }

      console.log("Sending prompt to server with user ID:", prompt, userId);
      const res = await axios.post(buildApiUrl('/chat'), { 
        prompt,
        userId // Include the user ID in the request
      });
      
      console.log("Received response:", res.data);
      
      if (res.data && res.data.response) {
        setResponse(res.data.response);
      } else if (res.data && typeof res.data === 'string') {
        // Handle old response format for backward compatibility
        setResponse(res.data);
      } else if (res.data && res.data.error) {
        setResponse(`Error: ${res.data.error}`);
      } else {
        setResponse("Received an unexpected response format from the server.");
      }
    } catch (error) {
      console.error("Error in chat request:", error);
      setResponse(
        error.response?.data?.error || 
        "Sorry, there was an error processing your request. Please try again later."
      );
    }

    setLoading(false);
    setPrompt("");
  };

  const handlePrompt = (e) => {
    setPrompt(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
        alignItems: "center",
        position: "relative",
        background: "rgba(7,65,65,0.881)",
        padding: "20px",
        overflow: "visible", // Allow content outside the box
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{
          borderRadius: ["16px 16px 8px 0", "16px 16px 8px 8px"], // Adjust border radius on hover
        }}
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            width: "100%",
            bgcolor: "#fff",
            borderRadius: "16px 16px 8px 8px",
            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            position: "relative",
            backdropFilter: "blur(10px)", // Add backdrop filter for a modern look
            border: "1px solid rgba(255, 255, 255, 0.2)", // Add a subtle border
            transition: "all 0.3s ease", // Add transition for smoother changes
            "&:hover": {
              transform: "translateY(-5px)", // Add a subtle hover effect
              boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)", // Enhance the shadow on hover
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#42a5f5",
              color: "#fff",
              padding: 2,
              borderRadius: "16px 16px 0 0",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <HealthAndSafetyIcon 
              fontSize="large" 
              sx={{ 
                mr: 1, 
                color: "#fff",
                filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.2))",
              }} 
            />
            <Typography 
              variant="h6" 
              component="h3" 
              align="center" 
              sx={{ 
                fontWeight: "bold",
                color: "#fff",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                letterSpacing: "0.5px",
                lineHeight: 1.2,
              }} 
            >
              Gemini Medical Assistant
            </Typography>
          </Box>

          {/* Patient context indicator */}
          {userId && (
            <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: '#42a5f5' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Your medical context is being used to provide personalized responses
                </Typography>
              </Box>
              
              {patientData && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label={`Name: ${patientData.fullName || 'Not available'}`} 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                  />
                  {patientData.gender && (
                    <Chip 
                      label={`Gender: ${patientData.gender}`} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                    />
                  )}
                </Box>
              )}
            </Box>
          )}
          
          <Box 
            sx={{ 
              padding: "2rem",
            }} 
          >
            <form 
              onSubmit={handleSubmit} 
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TextField
                label="Ask your health questions"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={prompt}
                onChange={handlePrompt}
                onKeyPress={handleKeyPress}
                disabled={loading}
                sx={{ 
                  mb: 2,
                  "& .MuiInputLabel-root": {
                    color: "#42a5f5", // Adjust label color for contrast
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px", // Adjust border radius for consistency
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#42a5f5", // Adjust outline color for contrast
                  },
                  "& .MuiOutlinedInput-input": {
                    fontSize: "18px", // Adjust input font size
                    color: "#333", // Adjust input text color for contrast
                  },
                }}
              />

              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  width: "100%",
                  bgcolor: "#007bff",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  borderRadius: "16px", // Add border radius for a rounded appearance
                  transition: "background-color 0.3s ease", // Add transition effect for smoother color changes
                  "&:hover": { 
                    bgcolor: "#0056b3", // Adjust background color on hover
                  },
                  "&:disabled": {
                    bgcolor: "#999", // Adjust background color when disabled
                  },
                }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} sx={{ marginRight: 1 }} /> // Add margin for spacing
                ) : (
                  "Ask"
                )}
              </Button>
            </form>
            
            <Box
              sx={{
                mt: 2,
                bgcolor: "#f9f9f9",
                padding: 2,
                borderRadius: 2,
                border: "1px solid #ddd",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease", // Add transition effect for smoother changes
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adjust shadow on hover
                },
                minHeight: "150px", // Set a minimum height
                display: "flex",
                alignItems: loading ? "center" : "flex-start",
                justifyContent: loading || !response ? "center" : "flex-start",
              }}
            >
              {loading ? (
                <CircularProgress />
              ) : response ? (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: 16, 
                    lineHeight: 1.6, 
                    color: "#333", 
                    whiteSpace: "pre-wrap" // Preserve line breaks
                  }}
                >
                  {response}
                </Typography>
              ) : (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    fontStyle: "italic",
                    textAlign: "center",
                    width: "100%"
                  }}
                >
                  Ask a health-related question to get a response from our AI-powered medical assistant.
                </Typography>
              )}
            </Box>
            
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: "block", 
                mt: 2,
                textAlign: "center",
                fontSize: "0.75rem"
              }}
            >
              Powered by Google Gemini AI. For informational purposes only. 
              <br/>
              Always consult with healthcare professionals for medical advice.
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
