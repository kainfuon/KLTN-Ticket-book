import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/LoginPage";
import SignUp from "./pages/Login/SignupPage";
import Home from "./pages/User/Home";
import UserDashboard from "./pages/User/UserDashboard";
import TicketDisplay from "./components/User/TicketDisplay";
import TradeTicket from "./components/User/TradeTicket";
import UserProfile from "./components/User/UserProfile";
import ViewEvent from "./pages/User/ViewEvent";
import OrderConfirmation from "./components/User/OderComfirmation";
import VerifyPayment from "./components/User/VerifyPayment";

import Dashboard from "./pages/Admin/Dashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import EventList from "./components/Admin/EventList";
import EventAdd from "./components/Admin/EventAdd";
import EventDetail from "./components/Admin/EventDetail";
import Statistics from "./components/Admin/Statistics";
import AdminRoute from "./routes/AdminRoute"; // Import middleware
import ScalpersList from "./components/Admin/ScalpersList";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/home" element={<Home />} />
                <Route path="/events/:id" element={<ViewEvent />} />
                <Route path="/place-order" element={<OrderConfirmation />} />
                <Route path="/verify" element={<VerifyPayment />} />
                <Route path="/user" element={<UserDashboard />}>
                    <Route path="tickets" element={<TicketDisplay />} />
                    <Route path="trade" element={<TradeTicket />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route index element={<TicketDisplay />} />
                </Route>
                {/* Bảo vệ các route admin */}
                <Route path="/admin" element={<AdminRoute />}>
                {/* Dashboard làm layout chứa Sidebar, Navbar và Outlet cho các trang con */}
                <Route element={<Dashboard />}>
                    {/* Trang mặc định khi truy cập /admin */}
                    <Route index element={<AdminDashboard />} />
                    {/* Các route admin khác */}
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="events" element={<EventList />} />
                    <Route path="events/add" element={<EventAdd />} /> {/* Add this line */}
                    <Route path="events/edit/:id" element={<EventAdd/>} />
                    <Route path="events/:id" element={<EventDetail />} />
                    <Route path="statistics" element={<Statistics />} />
                    <Route path="scalpers" element={<ScalpersList />} />
                    {/* Bạn có thể thêm các route khác như customers, tickets, ... */}
                </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
