/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/utils/ScrollToTop';
import Home from './pages/Home';
import { Apply } from './pages/Apply';
import About from './pages/About';
import Qualification from './pages/Qualification';
import Retraining from './pages/Retraining';
import PreUniversity from './pages/PreUniversity';
import Alumni from './pages/Alumni';
import Contacts from './pages/Contacts';
import Documents from './pages/Documents';
import Partners from './pages/Partners';
import Staff from './pages/Staff';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import NotFound from './pages/NotFound';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminPrograms from './pages/admin/AdminPrograms';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogin from './pages/admin/AdminLogin';
import { ProgramsProvider } from './context/ProgramsContext';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <ProgramsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
        {/* Admin CMS Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="apply" element={<Apply />} />
          <Route path="programs" element={<Programs />} />
          <Route path="programs/:id" element={<ProgramDetail />} />
          <Route path="about" element={<About />} />
          <Route path="qualification" element={<Qualification />} />
          <Route path="retraining" element={<Retraining />} />
          <Route path="pre-university" element={<PreUniversity />} />
          <Route path="alumni" element={<Alumni />} />
          <Route path="documents" element={<Documents />} />
          <Route path="partners" element={<Partners />} />
          <Route path="staff" element={<Staff />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="*" element={<NotFound />} />
        </Route>
          </Routes>
        </BrowserRouter>
      </ProgramsProvider>
    </LanguageProvider>
  );
}
