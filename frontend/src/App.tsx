import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import TableView from './pages/TableView';
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/table" element={<TableView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
