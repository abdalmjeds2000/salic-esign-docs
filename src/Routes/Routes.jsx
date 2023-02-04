import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ESignDocument from '../pages/ESignDocument';
import File404 from "../pages/File404";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/file" />} />
      <Route path='/file' element={<ESignDocument />} />
      <Route path='/404-file' element={<File404 />} />
    </Routes>
  )
}

export default AppRoutes;
