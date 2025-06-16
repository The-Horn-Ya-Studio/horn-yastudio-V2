import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { GlobalStyleProvider } from './styles/globalStyles';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import AdminPanel from './pages/AdminPanel';
import AdminGallery from './pages/AdminGallery';
import MembersPage from './pages/MembersPage';
import MemberDetail from './pages/MemberDetail';
import Login from './pages/Login';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <GlobalStyleProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Header />
              <main style={mainStyle}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/members" element={<MembersPage />} />
                  <Route path="/members/:id" element={<MemberDetail />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/gallery" element={
                    <ProtectedRoute>
                      <AdminGallery />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </GlobalStyleProvider>
  );
};

const mainStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 200px)',
  padding: '2rem 1rem',
};

export default App;
