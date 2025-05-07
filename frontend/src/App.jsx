import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import Contact from "./pages/User/Contact";
import Footer from './components/Footer';
import Dashboard from "./pages/Admin/Dashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import EventList from "./components/Admin/EventList";
import EventAdd from "./components/Admin/EventAdd";
import EventDetail from "./components/Admin/EventDetail";
import Statistics from "./components/Admin/Statistics";
import AdminRoute from "./routes/AdminRoute";
import ScalpersList from "./components/Admin/ScalpersList";
import PendingTradesPage from "./pages/User/PendingTradesPage";
import TradeConfirmationPage from "./pages/User/TradeConfirmationPage";

// Layout wrapper component to handle footer display
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Don't show footer on admin pages and auth pages
  const hideFooter = 
    location.pathname.startsWith('/admin') || 
    location.pathname === '/login' || 
    location.pathname === '/signup' ||
    location.pathname === '/' ||
    location.pathname === '/verify' ||
    location.pathname === '/place-order';

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {children}
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp/>}/>
          
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/events/:id" element={<ViewEvent />} />
          <Route path="/place-order" element={<OrderConfirmation />} />
          <Route path="/verify" element={<VerifyPayment />} />
          <Route path="/trade" element={<TradeTicket />} />
          <Route path="/verify-trade" element={<TradeConfirmationPage />} /> 
          {/* User Dashboard Routes */}
          <Route path="/user" element={<UserDashboard />}>
            <Route path="tickets" element={<TicketDisplay />} />
            <Route path="trade" element={<PendingTradesPage/>}/>
            <Route path="profile" element={<UserProfile />} />
            <Route index element={<TicketDisplay />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<Dashboard />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="events" element={<EventList />} />
              <Route path="events/add" element={<EventAdd />} />
              <Route path="events/edit/:id" element={<EventAdd/>} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="scalpers" element={<ScalpersList />} />
            </Route>
          </Route>
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
