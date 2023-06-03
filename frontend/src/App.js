import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import ImageGrid from './ImageGrid';
import ImageDetails from './ImageDetails';
//import BuildTime from './BuildTime';
import AppHeader from './AppHeader';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/image/:hash" element={<ImageDetails />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/check-auth');
      const data = await response.json();
      if (data.message === 'Authenticated') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching authentication status:', error);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = async () => {
    await fetch('/logout', { method: 'GET', credentials: 'include' });
    checkAuthStatus();
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <AppHeader
          isAuthenticated={isAuthenticated}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          navigate={navigate}
        />
        <header className="App-header">
          <h1>{message}</h1>
        </header>
      </div>
    </ThemeProvider>
  );
}

function Profile() {
  const [uploadStatus, setUploadStatus] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/check-auth');
      const data = await response.json();
      if (data.message === 'Authenticated') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching authentication status:', error);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = async () => {
    await fetch('/logout', { method: 'GET', credentials: 'include' });
    checkAuthStatus();
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadStatus('Image uploading...');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey after a successful upload
        setUploadStatus('Image uploaded successfully');
      } else {
        setUploadStatus('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus('Image upload failed');
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <AppHeader
          isAuthenticated={isAuthenticated}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          navigate={navigate}
        />
        <header className="App-header">
          {isAuthenticated ? (
            <>
              <input type="file" onChange={handleUpload} />
              <p>{uploadStatus}</p>
              <ImageGrid refreshKey={refreshKey} />
            </>
          ) : (
            <p>Please log in to view and upload images.</p>
          )}
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
