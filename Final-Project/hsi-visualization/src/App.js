import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import './styles/App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const categoryList = [
      "Built-up",
      "Consolidated Barren",
      "Shrubs and Natural Grassland",
      "Natural Wooded Land",
      "Permanent Crops",
      "Planted Forest",
      "Annual Crops",
      "Unconsolidated Barren",
      "Waterbodies"
    ];
    setCategories(categoryList);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="App">
      <TopBar title="Land Classification Visualization" />
      <div className="layout">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        <div className="map-container">
          <MapContainer selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
}

export default App;
