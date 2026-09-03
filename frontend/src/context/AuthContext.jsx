import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mb_token') || 'demo_token_sanjay');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const fetchCurrentUser = () => {
    const storedRole = localStorage.getItem('mb_role') || 'patient';
    setUser({
      id: storedRole === 'caregiver' ? 'usr_caregiver_1' : 'usr_patient_sanjay',
      name: storedRole === 'caregiver' ? 'Meera Sharma' : 'Sanjay Singhania',
      email: storedRole === 'caregiver' ? 'caregiver@memorybridge.org' : 'sanjay@memorybridge.org',
      role: storedRole,
      patientId: 'pat_sanjay_72'
    });
    setLoading(false);
  };

  const loginDemo = async (role = 'patient') => {
    setLoading(true);
    const mockToken = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('mb_token', mockToken);
    localStorage.setItem('mb_role', role);
    setToken(mockToken);
    
    const fallbackUser = {
      id: role === 'caregiver' ? 'usr_caregiver_1' : 'usr_patient_sanjay',
      name: role === 'caregiver' ? 'Meera Sharma' : 'Sanjay Singhania',
      email: role === 'caregiver' ? 'caregiver@memorybridge.org' : 'sanjay@memorybridge.org',
      role,
      patientId: 'pat_sanjay_72'
    };
    setUser(fallbackUser);
    setLoading(false);
    return fallbackUser;
  };

  const logout = () => {
    localStorage.removeItem('mb_token');
    localStorage.removeItem('mb_role');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
