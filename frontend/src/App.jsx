import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/LoginPage";
import SignUp from "./pages/Login/SignupPage";
import Home from "./pages/User/Home";
import Dashboard from "./pages/Admin/Dashboard";
import AdminRoute from "./routes/AdminRoute"; // Import middleware

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/home" element={<Home />} />
                {/* <Route path="/admin" element={<Dashboard />}></Route> */}
                {/* Bảo vệ route admin */}
                <Route path="/admin" element={<AdminRoute />}>
                    <Route index element={<Dashboard />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
