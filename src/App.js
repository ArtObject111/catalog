import { Route, Routes } from 'react-router-dom';
import './App.css';
import Goods from './components/Goods/Goods';

const App = () => {
  return (
        <Routes>
          <Route path="/" element={<Goods />} />
        </Routes>
  );
}

export default App;
