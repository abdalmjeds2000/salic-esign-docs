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
      <Route path='/file' element={isAllowShowDoc ? <ESignDocument /> : <Navigate to="/check" replace={true} />} />
      <Route path='/404-file' element={<File404 />} />
      <Route path='/check' element={isAllowShowDoc ? <Navigate to="/file" replace={true} /> : <OTP />} />
    </Routes>
  )
}

export default AppRoutes;
