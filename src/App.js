import { Route, Routes } from 'react-router-dom';
import './App.css';
import { FilterBar } from './components/FilterBar/FilterBar';
import { Header } from './components/Header/Header';
import Goods from './components/Goods/Goods';

const App = () => {
  return (
    <div className="app-wrapper">
      <Header />
      <FilterBar />
      <div className="app-wrapper-content">
        <Routes>
          <Route path="/" element={<Goods />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
