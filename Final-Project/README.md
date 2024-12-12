# Hyperspectral Land Cover Classification Visualization

The underlying ML model and classification process are described in more detail in the [Hyperspectral-Landcover-Classification](https://github.com/harrisb002/Hyperspectral-Landcover-Classification) repository.

This project provides an interactive, web-based visualization platform for exploring hyperspectral land cover classification results derived from AVIRIS-NG imagery. It integrates geospatial data, predictions from a machine learning (ML) model, and aggregated frequency data into a coherent visual interface, enabling researchers, ecologists, and stakeholders to intuitively understand and analyze landscape patterns in the Greater Cape Floristic Region of South Africa.

<div>
  <a href="https://github.com/harrisb002/cs375">
    <img src="./Final-Project/hsi-visualization/assets/CapeRegion.png" alt="Cape Region Map" width="600" height="400">
  </a>
  <a href="https://github.com/harrisb002/cs375">
    <img src="./Final-Project/hsi-visualization/assets/marker_map.png" alt="Marker Map" width="600" height="400">
  </a>
</div>

## About The Project

### A Larger Initiative: BioSCape

This work aligns with the BioSCape research project—a collaboration between NASA, the South African National Space Agency (SANSA), and associated institutions—focused on biodiversity mapping and ecological understanding in the Greater Cape Floristic Region. Leveraging high-fidelity hyperspectral data, this platform helps make complex spectral classification results accessible and actionable.

<a href="https://github.com/harrisb002/cs375">
  <img src="./Final-Project/hsi-visualization/assets/bioscape_logo.png" alt="BioSCape Logo" width="125" height="75">
</a>

## Background

Using AVIRIS-NG hyperspectral images (432 spectral bands), a range of land cover types have been classified, including:

<a href="https://github.com/harrisb002/cs375">
  <img src="./Final-Project/hsi-visualization/assets/HyperSpectral_cube.png" alt="Hyperspectral Cube" width="200" height="100">
</a>

- Planted Forest
- Permanent Crops (e.g., vineyards)
- Unconsolidated Barren
- Natural Grassland
- Consolidated Barren (e.g., rocks, salt pans)
- Built-up Areas
- Natural Wooded Land
- Waterbodies
- Annual Crops (e.g., wheat)
- Shrubs

These classifications are critical for understanding biodiversity distribution, habitat quality, and land-use changes, all of which support ecological research, conservation planning, and resource management within the BioSCape initiative.

## Features and Functionalities

### Geospatial Visualization with Google Maps

The platform uses the Google Maps API for an intuitive spatial interface:

- **Marker-based Visualization:**  
  Classified sample points are displayed as markers on a satellite basemap. Green markers indicate correctly predicted labels (based on ground truth), while red markers indicate discrepancies.

  **Example (Marker Map with Predictions):**  
  <a href="https://github.com/harrisb002/cs375">
  <img src="./Final-Project/hsi-visualization/assets/marker_map.png" alt="Marker Map Example" width="500" height="250">
  </a>

- **Category-Based Filtering:**  
  A sidebar allows users to filter land cover samples by category. Choosing a category (e.g., "Shrubs and Natural Grassland") highlights only those samples, making pattern recognition straightforward.

- **Interactive Info Windows:**  
  Clicking a marker displays detailed metadata: sample number, ground truth label, predicted label, and options to add the sample to further analytical plots (e.g., scatter or bar plots).

  <a href="https://github.com/harrisb002/cs375">
    <img src="./Final-Project/hsi-visualization/assets/info_window.png" alt="Info Window Example" width="600" height="400">
  </a>

### Hexagon Layer Visualization

Beyond simple markers, the tool can display aggregated frequency data using a hexagonal binning layer powered by [deck.gl](https://deck.gl/):

- **Pre-Aggregated Frequency Sums:**  
  Frequency values from hyperspectral samples are aggregated and stored in a MongoDB backend, enabling quick retrieval of summarized data. This reduces memory load and improves performance.

- **3D Hexagon Layer:**  
  A HexagonLayer renders vertical columns at sample locations, with height and color encoding frequency sums. This provides an immediate sense of spatial distribution and intensity patterns across the landscape.

  ![Hex Layer Visualization](./Final-Project/hsi-visualization/assets/hex_layer.png)

- **Adjustable Parameters:**  
  A control panel allows real-time adjustments of coverage, radius, and upper percentile parameters, enabling dynamic exploration of spatial frequency distributions.

### Bar and Scatter Plots for Detailed Analysis

For deeper dives into spectral distributions:

- **Bar Plot:**  
  Users can select individual samples and generate histograms (bar plots) of frequency distributions.

    <a href="https://github.com/harrisb002/cs375">
      <img src="./Final-Project/hsi-visualization/assets/sample_selected.png" alt="Sample Bar Plot" width="200" height="300">
    </a>

  This allows closer inspection of the underlying spectral frequency ranges for a chosen sample, revealing how spectral values cluster within intervals.

  ![Bar Plots of Frequency Distributions](./Final-Project/hsi-visualization/assets/bar_plots.png)

- **Scatter Plot (for Frequencies):**  
  Users can also view scatter plots for selected frequency bands or combinations thereof, helping them identify relationships or anomalies in spectral signatures.

---

## Getting Started

1. **Prerequisites**:

   - Node.js and npm installed locally.
   - A MongoDB database (Atlas or local) with the required collections (samples, polygons, predictions, frequency_summary).

2. **Setup**:

   - Clone the repository.
   - Run `npm install` to install dependencies.
   - Set environment variables in a `.env` file at the project root:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
REACT_APP_BACKEND_URL=http://localhost:4000
```
