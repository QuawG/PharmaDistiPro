import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import MyComponent from "./pages/Dashboard/Dashboard/Dashboard";

function App() {

  return (
    <>
       <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<HomePage />} /> 
      </Routes>
    </Router>
    </>
  )
}

export default App
