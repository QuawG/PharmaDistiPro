import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/Customer/SignIn";
import SignUp from "./components/Customer/SignUp";
import HomePage from "./pages/HomePage";

function App() {

  return (
    <>
       <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<HomePage />} /> 
      </Routes>
    </Router>
    </>
  )
}

export default App
