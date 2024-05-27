import React, { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import path from "./utils/path"
import { FinalRegister, Login } from "./pages"

function App() {
  return (
    <div className="font-jp">
      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
      </Routes>
    </div>
  )
}
export default App