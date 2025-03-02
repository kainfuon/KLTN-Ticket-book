import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/LoginPage";
import Home from "./pages/User/Home";
import Dashboard from "./pages/Admin/Dashboard";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/user" element={<Home />} />
                <Route path="/admin" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
