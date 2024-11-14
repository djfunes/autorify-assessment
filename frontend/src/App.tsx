// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SurvivalList from './components/Survivor/SurvivalList';
import ItemList from './components/Item/ItemList';
import SurvivorComponent from './components/Survivor/Survivor';
import ItemComponent from './components/Item/Item';
import Reports from './components/Reports/Reports';
import InventoryComponent from './components/Inventory/InventoryComponent';
import TradeComponent from './components/Trade/TradeComponent';

function App() {
  const handleSurvivorSubmit = (survivor: any) => {
    console.log(survivor);
  };

  const handleItemSubmit = (item: any) => {
    console.log(item);
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<SurvivalList />} />
        <Route path="/new-survivor" element={<SurvivorComponent onSubmit={handleSurvivorSubmit} />} />
        <Route path="/survivor/:id" element={<SurvivorComponent onSubmit={handleSurvivorSubmit} />} />
        <Route path="/survivor/inventory/:id" element={<InventoryComponent />} />
        <Route path="/survivor/trades/:id" element={<TradeComponent />} />
        <Route path="/survivor-list" element={<SurvivalList />} />
        <Route path="/items/:id" element={<ItemComponent onSubmit={handleItemSubmit} />} />
        <Route path="/new-item" element={<ItemComponent onSubmit={handleItemSubmit} />} />
        <Route path="/item-list" element={<ItemList />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </>
  );
}

export default App;
