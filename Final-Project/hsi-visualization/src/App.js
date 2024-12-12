import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScatterPlotPage from './components/ScatterPlotPage';
import BarPlotPage from './components/BarPlotPage';
import HexCartoPage from './components/HexCartoPage';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedScatterMarkers, setSelectedScatterMarkers] = useState([]);
  const [selectedBarMarkers, setSelectedBarMarkers] = useState([]);
  const [showHexLayer, setShowHexLayer] = useState(false);

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
    <Router>
      <div className="App">
        <TopBar title="Land Classification Visualization" />
        <div className="layout">
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            selectedScatterMarkers={selectedScatterMarkers}
            selectedBarMarkers={selectedBarMarkers}
          />
          <div className="map-container">
            <Routes>
              <Route
                path="/"
                element={
                  <MapContainer
                    selectedCategory={selectedCategory}
                    selectedScatterMarkers={selectedScatterMarkers}
                    setSelectedScatterMarkers={setSelectedScatterMarkers}
                    selectedBarMarkers={selectedBarMarkers}
                    setSelectedBarMarkers={setSelectedBarMarkers}
                    showHexLayer={showHexLayer}
                    setShowHexLayer={setShowHexLayer}
                  />
                }
              />
              <Route
                path="/scatter"
                element={
                  <ScatterPlotPage
                    selectedMarkers={selectedScatterMarkers}
                    setSelectedMarkers={setSelectedScatterMarkers}
                  />
                }
              />
              <Route
                path="/bar"
                element={
                  <BarPlotPage
                    selectedMarkers={selectedBarMarkers}
                    setSelectedMarkers={setSelectedBarMarkers}
                  />
                }
              />
              <Route
                path="/hex-carto"
                element={<HexCartoPage />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
