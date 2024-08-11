'use client'
import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Container, Stack, IconButton, Modal, Snackbar, Alert
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Header from './components/header';
import Review from './components/review';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [authState, setAuthState] = useState('loggedOut'); // 'loggedOut', 'signIn', 'signUp', 'loggedIn'
  const [snackMessage, setSnackMessage] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    // Fetch a random background image from Unsplash
    const fetchRandomImage = async () => {
      try {
        const response = await fetch('https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY');
        const data = await response.json();
        setBgImage(data[0]?.urls?.regular || '');
      } catch (error) {
        console.error('Error fetching background image:', error);
        setBgImage(''); // Set a default image or fallback if needed
      }
    };

    fetchRandomImage();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const sendMessage = async () => {
    try {
      if (message.toLowerCase() === 'y') {
        setOpenModal(true);
      }
      
      const newHistory = [...history, { role: 'user', parts: [{ text: message }] }];
      setHistory(newHistory);
      setMessage('');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHistory),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setHistory((history) => [...history, { role: 'model', parts: [{ text: data.message }] }]);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const clearConversation = () => {
    setHistory([]);
    setMessage('');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Conversation Log', 14, 16);

    const columns = ['Role', 'Message'];
    const rows = history.map((item) => [item.role, item.parts[0].text]);
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save(`conversation_log_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleAuth = (type) => {
    setAuthState(type);
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    // Simulate authentication logic
    if (authState === 'signIn') {
      console.log('Signing in with', { email, password });
      setAuthState('loggedIn');
      setSnackMessage('Sign-in successful');
      setSnackOpen(true);
    } else if (authState === 'signUp') {
      console.log('Signing up with', { email, password });
      setAuthState('loggedIn');
      setSnackMessage('User created successfully');
      setSnackOpen(true);
    }
  };

  const AuthForm = () => {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: darkMode ? '#424242' : '#fff',
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h5">
            {authState === 'signIn' ? 'Sign In' : 'Sign Up'}
          </Typography>
          <Box component="form" onSubmit={handleAuthSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={authState === 'signIn' ? 'current-password' : 'new-password'}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {authState === 'signIn' ? 'Sign In' : 'Sign Up'}
            </Button>
            {authState === 'signIn' && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{ mt: 2 }}
              >
                Sign in with Google
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    );
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: darkMode ? 'white' : 'black',
      }}
    >
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {authState === 'loggedOut' && (
        <Box>
          <Button variant="contained" onClick={() => handleAuth('signIn')}>
            Sign In
          </Button>
          <Button variant="contained" onClick={() => handleAuth('signUp')} sx={{ ml: 2 }}>
            Sign Up
          </Button>
        </Box>
      )}

      {(authState === 'signIn' || authState === 'signUp') && <AuthForm />}

      {authState === 'loggedIn' && (
        <Stack
          direction="column"
          width="600px"
          height="600px"
          boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
          borderRadius={8}
          bgcolor={darkMode ? '#333' : 'white'}
          p={2}
          spacing={3}
          overflow="auto"
          marginBottom="5%"
        >
          <Stack direction="row" display="flex">
            <Button
              onClick={clearConversation}
              sx={{
                alignSelf: 'flex-start',
                mb: 1,
                paddingRight: '10px',
                position: 'static',
                bgcolor: darkMode ? 'grey.800' : 'grey.300',
                color: darkMode ? 'white' : 'black',
              }}
            >
              <DeleteOutlinedIcon /> Clear
            </Button>
            <Button
              onClick={generatePDF}
              sx={{
                alignSelf: 'flex-start',
                position: 'static',
                mb: 1,
                bgcolor: darkMode ? 'grey.800' : 'grey.300',
                color: darkMode ? 'white' : 'black',
                marginLeft: '2%',
              }}
            >
              <DownloadIcon />
            </Button>
            <Button
              onClick={() => handleAuth('loggedOut')}
              sx={{
                alignSelf: 'flex-end',
                mb: 1,
                paddingRight: '10px',
                position: 'static',
                bgcolor: darkMode ? 'grey.800' : 'grey.300',
                color: darkMode ? 'white' : 'black',
              }}
            >
              Sign Out
            </Button>
          </Stack>
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
            pr={1}
          >
            {history.map((textObject, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="column"
                alignItems={textObject.role === 'user' ? 'flex-end' : 'flex-start'}
                mb={2}
              >
                {textObject.role !== 'user' && (
                  <Typography
                    fontSize="15px"
                    color={darkMode ? 'white' : 'grey.500'}
                    mb={1}
                    marginLeft={2}
                  >
                    Headstarter Assistant
                  </Typography>
                )}
                {textObject.parts.map((part, partIndex) => (
                  <Box
                    key={partIndex}
                    bgcolor={
                      textObject.role === 'user'
                        ? darkMode
                          ? '#4a4a4a'
                          : '#e0e0e0'
                        : darkMode
                        ? '#333'
                        : '#f1f1f1'
                    }
                    borderRadius={2}
                    p={2}
                    mb={1}
                    maxWidth="80%"
                    textAlign={textObject.role === 'user' ? 'right' : 'left'}
                  >
                    <Typography color={textObject.role === 'user' ? 'black' : 'black'}>
                      {part.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Stack>
          <Box display="flex" alignItems="center" mt={2}>
            <TextField
              variant="outlined"
              placeholder="Type your message here..."
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              disabled={message.trim() === ''}
              sx={{ ml: 1 }}
            >
              <ArrowUpwardIcon />
            </IconButton>
          </Box>
        </Stack>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            width: 300,
            height: 200,
            bgcolor: 'white',
            p: 4,
            m: 'auto',
            mt: '20%',
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Do you want to export the chat log to PDF?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={generatePDF}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        message={snackMessage}
        action={
          <Button color="inherit" onClick={handleSnackClose}>
            Close
          </Button>
        }
      >
        <Alert onClose={handleSnackClose} severity="success">
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
