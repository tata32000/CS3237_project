import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import LoginComponent from './LoginComponent';
import MainPage from './MainPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
      } else {
        // User is signed out
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/main" /> : <LoginComponent />} />
        <Route path="/main" element={<MainPage />} />
        {/* Redirect to /main if no matching route and user is logged in */}
        <Route path="*" element={isLoggedIn ? <Navigate to="/main" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
