import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Layout from './Layout';
import Home from './pages/Home';
import TableView from './pages/TableView';
import ChartView from './pages/ChartView';
import ChartPieLabel from './pages/temp';
import Graph from './pages/Graph';
import Dashboard from './pages/Dashboard';

import ReportsPage from './pages/ReportsPage';

function App() {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<TableView />} />
            <Route path="/charts" element={<ChartView />} />
            <Route path="/graphs" element={<Graph />} />
            <Route path="/temp" element={<ChartPieLabel />} />
            <Route path="/reports" element={<ReportsPage />} />
            {/* <Route path="/example-sidebar" element={<Page />} /> */}
          </Routes>
        </Layout>
      </Router>
      // <Dashboard/>
  );
}

export default App;
