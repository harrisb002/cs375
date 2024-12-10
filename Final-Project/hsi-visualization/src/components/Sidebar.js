import React from 'react';
import '../styles/Sidebar.css';

const categoryColors = {
    "Built-up": "rgba(255, 0, 0, 0.7)",
    "Consolidated Barren": "rgba(77, 77, 77, 0.7)",
    "Shrubs and Natural Grassland": "rgba(0, 255, 0, 0.7)",
    "Natural Wooded Land": "rgba(0, 100, 0, 0.7)",
    "Permanent Crops": "rgba(173, 216, 230, 0.7)",
    "Planted Forest": "rgba(128, 0, 128, 0.7)",
    "Annual Crops": "rgba(230, 230, 250, 0.7)",
    "Unconsolidated Barren": "rgba(165, 42, 42, 0.7)",
    "Waterbodies": "rgba(0, 0, 255, 0.7)",
};

export function Sidebar({ categories, selectedCategory, onCategorySelect }) {
    return (
        <div className="sidebar">
            <h3>Categories</h3>
            <ul>
                <li
                    className={!selectedCategory ? "active" : ""}
                    onClick={() => onCategorySelect(null)}
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", color: "#000" }}
                >
                    Show All
                </li>
                {categories && categories.length > 0 && categories.map((cat, index) => (
                    <li
                        key={index}
                        className={selectedCategory === cat ? "active" : ""}
                        onClick={() => onCategorySelect(cat)}
                        style={{
                            backgroundColor: categoryColors[cat],
                            color: "#000",
                        }}
                    >
                        {cat}
                    </li>
                ))}
            </ul>
        </div>
    );
}
