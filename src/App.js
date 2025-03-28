import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InventoryPage from './pages/InventoryPage';
import TaskPage from './pages/TaskPage';

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">在庫管理</Link> | <Link to="/tasks">タスク管理</Link>
      </nav>
      <Routes>
        <Route path="/" element={<InventoryPage />} />
        <Route path="/tasks" element={<TaskPage />} />
      </Routes>
    </Router>
  );
}

export default App;
