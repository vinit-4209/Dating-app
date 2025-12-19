import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ProfileCreation from './pages/ProfileCreation';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/create-profile" element={<ProfileCreation />} />
      </Routes>
    </Router>
  );
}

export default App;
