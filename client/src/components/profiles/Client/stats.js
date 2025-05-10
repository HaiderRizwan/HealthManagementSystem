import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './stats.css';
import TestResult from './TestResult';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AirIcon from '@mui/icons-material/Air';
import HeightIcon from '@mui/icons-material/Height';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { buildApiUrl } from '../../../config/api';

const Stats = ({ userId }) => {
  const [bloodtype, setBloodType] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [lungHealth, setLungHealth] = useState(0);
  const [boolval, setbool] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showBasicForm, setShowBasicForm] = useState(false);
  const [showBasicInfo, setShowBasicInfo] = useState(false);
  const [showLungCircle, setShowLungCircle] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkLungs = () => {
    setClickCount(prevClickCount => prevClickCount + 1);
    if (clickCount === 0) {
      setShowLungCircle(true);
      setStartTime(Date.now()); 
    } else if (clickCount === 1) {
      clearInterval(timerInterval);
      calculateHealth();
      // Reset all states to their initial values
      setTimer(0);
      setClickCount(0);
      setShowLungCircle(false);
      setbool(true);
    } 
  };
  
  const calculateHealth = () => {
    const endTime = Date.now(); // Record the end time
    const timeDifference = endTime - startTime; // Calculate the time difference in milliseconds
   
    const breathHoldingTime = Math.round(timeDifference / 100); 
    const health = Math.max(0, Math.min(100, breathHoldingTime)); // Ensure health is between 0-100
    console.log('Breath Holding Time:', breathHoldingTime, timeDifference);

    setLungHealth(health);
    console.log('Lung Health:', health, lungHealth);
  };

  const fetchBasicInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl(`/api/${userId}/check_basic_info`));
      const basicInfoData = response.data;
      console.log('Basic Info Data:', basicInfoData);
      // Assuming basic info is an object
      if (basicInfoData) {
        console.log('Age:', basicInfoData.age);
        console.log('Height:', basicInfoData.height);
        console.log('Weight:', basicInfoData.weight);
        // Assuming you have state variables to set age, height, and weight
        setAge(basicInfoData.age);
        setHeight(basicInfoData.height);
        setWeight(basicInfoData.weight);
        setShowBasicInfo(true);
      }
    } catch (error) {
      console.error('Error fetching basic info:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  const fetchBloodType = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl(`/api/${userId}/check_Bloodtype`));
      const bloodTypeData = response.data;
      console.log('Blood Type Data:', bloodTypeData);
      if (bloodTypeData.length > 0) {
        const firstBloodType = bloodTypeData[0];
        console.log('Blood Type:', firstBloodType.bloodtype);
        setBloodType(firstBloodType.bloodtype);
      }
    } catch (error) {
      console.error('Error fetching blood type:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodType();
    fetchBasicInfo();
  }, [userId]);

  const handleBloodTypeUpdate = async (event) => {
    const selectedBloodType = event.target.value;
    setBloodType(selectedBloodType);
    console.log('Selected blood type:', userId, selectedBloodType);
    try {
      const response = await axios.post(buildApiUrl(`/api/${userId}/post_Bloodtype`), {
        userId: userId,
        bloodType: selectedBloodType
      });

      console.log('Blood type updated successfully:', response.data);

    } catch (error) {
      console.error('Error from stats updating blood type:', error);
      // Handle error
    }
  };

  const handleBasicInfoUpdates = async () => {
    try {
      const response = await axios.post(buildApiUrl(`/api/${userId}/post_basic_info`), {
        userId: userId,
        age: age,
        height: height,
        weight: weight
      });

      console.log('Basic Info Updated successfully:', response.data);

    } catch (error) {
      console.error('Error from stats updating Basic Info:', error);
      // Handle error
    }
  };

  const handleBasicInfoClick = () => {
    if(showBasicInfo === true) {
      let BMI = weight/(height*height);
      setShowBasicForm(false);
      // Use state instead of direct DOM manipulation
    } else {
    setShowBasicForm(true);
      }
};

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
      let BMI = weight/(height*height);
      console.log(age, height, weight);
      setShowBasicForm(false);
      // Use state instead of direct DOM manipulation
    handleBasicInfoUpdates();
  }
};

  const calculateBMI = () => {
    if (!height || !weight) return "N/A";
    const bmi = weight / (height * height);
    return bmi.toFixed(1);
  };

  const getBMICategory = () => {
    const bmi = calculateBMI();
    if (bmi === "N/A") return "N/A";
    
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const getBMIColor = () => {
    const category = getBMICategory();
    switch(category) {
      case "Underweight": return "#2196f3"; // Blue
      case "Normal": return "#4caf50"; // Green
      case "Overweight": return "#ff9800"; // Orange
      case "Obese": return "#f44336"; // Red
      default: return "#9e9e9e"; // Grey
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ 
        fontWeight: 'bold',
        color: '#1976d2',
        borderBottom: '2px solid #1976d2',
        paddingBottom: 1,
        marginBottom: 3
      }}>
        Health Statistics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Blood Type Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ 
            height: '100%', 
            borderRadius: 2,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <BloodtypeIcon sx={{ fontSize: 28, color: '#f44336', mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">Blood Type</Typography>
              </Box>
              
      {bloodtype ? (
                <Box>
          <div className="blood circle d-flex align-items-center justify-content-center text-white animation-enabled">
            <p className='inner-p'>{bloodtype}</p>
          </div>
                </Box>
      ) : (
                <Box>
        <Select
  value={bloodtype}
  onChange={handleBloodTypeUpdate}
  displayEmpty
                    fullWidth
                    sx={{ mb: 2, height: 48 }}
>
                    <MenuItem value="" disabled>Select Blood Type</MenuItem>
  <MenuItem value='A+'>A+</MenuItem>
  <MenuItem value='A-'>A-</MenuItem>
  <MenuItem value='B+'>B+</MenuItem>
  <MenuItem value='B-'>B-</MenuItem>
  <MenuItem value='AB+'>AB+</MenuItem>
  <MenuItem value='AB-'>AB-</MenuItem>
  <MenuItem value='O+'>O+</MenuItem>
  <MenuItem value='O-'>O-</MenuItem>
</Select>
                  
                  <Typography variant="body2" color="text.secondary">
                    Please select your blood type
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Lung Health Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}
            onClick={checkLungs}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <AirIcon sx={{ fontSize: 28, color: '#2196f3', mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">Lung Health</Typography>
                <Tooltip title="Click once to start the test, then click again when you can't hold your breath anymore">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <div className={`rectangle1 ${lungHealth >= 80 ? 'green' : lungHealth >= 50 ? 'orange' : lungHealth > 0 ? 'red' : ''}`}>
                {showLungCircle ? (
                  <div className='inner-circle'></div>
                ) : (
                  <Box>
          {boolval ? (
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Lung Health
                        </Typography>
              <p className='health'>{lungHealth}%</p>
                      </Box>
          ) : (
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Lung Health Test
                        </Typography>
                        <Typography variant="body1">
                          Click to start the test.<br />
                          <strong>Click again when you can't hold your breath anymore</strong>
                        </Typography>
                      </Box>
                    )}
                  </Box>
          )}
        </div>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Basic Info Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}
            onClick={handleBasicInfoClick}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <HeightIcon sx={{ fontSize: 28, color: '#4caf50', mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">Basic Info</Typography>
              </Box>
              
              <div className="rectangle2">
      {showBasicForm ? (
        <div id='basic'>
        <form id='basicform' onKeyPress={handleKeyPress}>
                      <TextField
                type="number"
                        label="Age (Years)"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
              />
                      <TextField
                type="number"
                        label="Height (Meters)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
              />
                      <TextField
                type="number"
                        label="Weight (KGs)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => {
                          setShowBasicForm(false);
                          handleBasicInfoUpdates();
                        }}
                        fullWidth
                      >
                        Save
                      </Button>
            </form>
        </div>
          ) : (
            <div id='basic-info'>
                    {showBasicInfo ? (
                      <Box>
                        <Grid container spacing={1}>
                          <Grid item xs={6} sx={{ textAlign: 'left' }}>
                            <Typography variant="body1"><strong>Age:</strong></Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body1">{age} years</Typography>
                          </Grid>
                          
                          <Grid item xs={6} sx={{ textAlign: 'left' }}>
                            <Typography variant="body1"><strong>Height:</strong></Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body1">{height} m</Typography>
                          </Grid>
                          
                          <Grid item xs={6} sx={{ textAlign: 'left' }}>
                            <Typography variant="body1"><strong>Weight:</strong></Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body1">{weight} kg</Typography>
                          </Grid>
                          
                          <Grid item xs={6} sx={{ textAlign: 'left' }}>
                            <Typography variant="body1"><strong>BMI:</strong></Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body1" sx={{ color: getBMIColor(), fontWeight: 'bold' }}>
                              {calculateBMI()} ({getBMICategory()})
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                          Click to edit
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Basic Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Click to add your basic health information
                        </Typography>
                      </Box>
                    )}
            </div>
          )}
          </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Test Results Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Health Test Results
        </Typography>
<TestResult userId={userId} />
      </Box>
    </Box>
  );
};

export default Stats;
