import React from 'react'
import { Route, Routes } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import EmailVerificationPage from '../pages/EmailVerificationPage';
import HomePage from '../pages/HomePage';
import MyProjectsPage from '../pages/MyProjectsPage';
import Project from '../pages/Project';

import { Toaster } from 'react-hot-toast';

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/my-projects" element={<MyProjectsPage />} />
        <Route path="/project/:id" element={<Project />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default AppRouter