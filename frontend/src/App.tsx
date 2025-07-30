import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Layout from './Layout';
import Home from './pages/Home';
import TableView from './pages/Transactions';
import ChartView from './pages/ChartView';
import ChartPieLabel from './pages/temp';
import Graph from './pages/Graph';

import ReportsPage from './pages/ReportsPage';
import Accounts from './pages/Accounts';
import AccountPage from './pages/Account';

function App() {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/:accountName" element={<AccountPage />} />
            <Route path="/transactions" element={<TableView />} />
            <Route path="/charts" element={<ChartView />} />
            <Route path="/graphs" element={<Graph />} />
            <Route path="/temp" element={<ChartPieLabel />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </Layout>
      </Router>
      // <Dashboard/>
  );
}

export default App;
