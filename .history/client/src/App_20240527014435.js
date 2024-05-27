import React, { useEffect } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import path from "./utils/path"
import { FinalRegister, Login, ResetPassword } from "./pages"

function App() {
  return (
    <div className="font-jp">
      <Routes>
        <Route path="/" element={<Navigate to={path.LOGIN} />} />
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.RESET_PASSWORD} element={<ResetPassword/>} />
      </Routes>
      {/* Same as */}
      <ToastContainer />
    </div>
  )
}
export default App