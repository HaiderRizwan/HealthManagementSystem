import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, CircularProgress, Typography, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { motion } from "framer-motion";
import { buildApiUrl } from '../../../config/api';

export default function AiChatbot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

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

      console.log("Sending prompt to server:", prompt);
      const res = await axios.post(buildApiUrl('/chat'), { prompt });
      
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
    borderRadius: "16px 16px 8px 8px",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
    backdropFilter: "blur(10px)", // Add backdrop filter for a modern look
    border: "1px solid rgba(255, 255, 255, 0.2)", // Add a subtle border
    transition: "all 0.3s ease", // Add transition for smoother changes
    "&:hover": {
      transform: "translateY(-5px)", // Add a subtle hover effect
      boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)", // Enhance the shadow on hover
    },
  }}
>
<ChatIcon 
  fontSize="large" 
  sx={{ 
    mr: 1, 
    color: "#fff", // Set icon color to white for contrast
    filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.2))", // Add a subtle drop shadow for depth
  }} 
/>
<Typography 
  variant="h6" 
  component="h3" 
  align="center" 
  sx={{ 
    fontWeight: "bold", // Set font weight to bold for emphasis
    color: "#fff", // Set text color to white for contrast
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // Add a subtle text shadow for depth
    letterSpacing: "0.5px", // Add a slight letter-spacing for refinement
    lineHeight: 1.2, // Adjust line height for better readability
  }} 
>

              Medical Assistant Chatbot
            </Typography>
          </Box>
          <Box 
  sx={{ 
    padding: "3rem", // Increase padding for more space
    transition: "padding 0.3s ease", // Add transition effect for smoother changes
    "&:hover": {
      padding: "3.2rem", // Adjust padding on hover for a subtle effect
    },
  }} 
>

<form 
  onSubmit={handleSubmit} 
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.3s ease", // Add transition effect for smoother changes
    "&:hover": {
      transform: "scale(1.02)", // Add a subtle scale effect on hover
    },
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
    bgcolor: "#fff",
    padding: 2,
    borderRadius: 2,
    border: "1px solid #ddd",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease", // Add transition effect for smoother changes
    "&:hover": {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adjust shadow on hover
    },
  }}
>
  <Typography 
    variant="body1" 
    sx={{ 
      fontSize: 18, 
      lineHeight: 1.6, 
      color: "#333", 
      textAlign: "center", // Center align the text
      padding: "1rem", // Add padding for spacing
    }}
  >
    {response ? response : "Ask me anything..."}
  </Typography>
</Box>

          </Box>
        </Box>
        </motion.div>
<motion.img
  src="https://cdn.pixabay.com/photo/2020/12/09/16/40/doctor-5817903_1280.png"
  alt="Doctor Icon"
  style={{
    position: "absolute",
    top: 35,
    left: "calc(50% - 50px)", // Center the icon horizontally
    width: 100,
    height: 100,
    zIndex: 0,
    transition: "all 0.3s ease", // Add transition effect for smoother changes
    "&:hover": {
      transform: "scale(1.1)", // Add a slight scale effect on hover
    },
  }}
  animate={{ rotate: loading ? -360 : 0 }}
  transition={{ duration: 1, ease: "linear" }}
/>
</Box>

  );
}
