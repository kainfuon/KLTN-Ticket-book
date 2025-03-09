// ... existing imports
import EventAdd from './components/Admin/EventAdd';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ... existing routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<Dashboard />}>
            {/* ... existing admin routes */}
            <Route path="events/add" element={<EventAdd />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};