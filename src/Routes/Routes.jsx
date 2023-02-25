import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import ESignDocument from '../pages/ESignDocument';
import File404 from "../pages/File404";
import OTP from "../pages/OTP";


const AppRoutes = () => {
  const { isAllowShowDoc } = useStateContext();
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/file" />} />
      <Route path='/file' element={isAllowShowDoc ? <ESignDocument /> : <OTP />} />
      <Route path='/404-file' element={<File404 />} />
    </Routes>
  )
}

export default AppRoutes;
