import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadProfile from './pages/LeadProfile';
import Pipeline from './pages/Pipeline';
import Agents from './pages/Agents';
import Integrations from './pages/Integrations';
import MLS from './pages/MLS';
import BackOffice from './pages/BackOffice';
import Blog from './pages/Blog';
import PropertyPage from './pages/PropertyPage';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding:40, fontFamily:'monospace', background:'#fff1f2', minHeight:'100vh' }}>
        <h2 style={{ color:'#b91c1c', marginBottom:16 }}>⚠️ RealCRM — Runtime Error</h2>
        <pre style={{ background:'#fff', border:'1px solid #fca5a5', padding:16, borderRadius:8, overflow:'auto', fontSize:13 }}>
          {this.state.error?.message}{'\n\n'}{this.state.error?.stack}
        </pre>
      </div>
    );
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"    element={<Dashboard />} />
              <Route path="leads"        element={<Leads />} />
              <Route path="leads/:id"    element={<LeadProfile />} />
              <Route path="pipeline"     element={<Pipeline />} />
              <Route path="mls"          element={<MLS />} />
              <Route path="backoffice"   element={<BackOffice />} />
              <Route path="agents"       element={<Agents />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="blog"         element={<Blog />} />
              <Route path="property/:mlsId" element={<PropertyPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
