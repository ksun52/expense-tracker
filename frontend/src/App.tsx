import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import TableView from './pages/TableView';
import ChartView from './pages/ChartView';
import ChartPieLabel from './pages/temp';
import Graph from './pages/Graph';
import Dashboard from './pages/Dashboard';
import './App.css'


function App() {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/table" element={<TableView />} />
            <Route path="/charts" element={<ChartView />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/temp" element={<ChartPieLabel />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/example-sidebar" element={<Page />} /> */}
          </Routes>
        </Layout>
      </Router>
  );
}

export default App;
