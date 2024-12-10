require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connected");
}).catch(err => console.error("MongoDB connection error:", err));

const polygonSchema = new mongoose.Schema({
    sample_num: Number,
    coordinates: [[Number]] // array of [lng, lat] pairs
});


const Polygon = mongoose.model('Polygon', polygonSchema);

app.get('/api/kml', async (req, res) => {
    try {
        const polygons = await Polygon.find({});
        res.json(polygons); // Send polygons data
    } catch (err) {
        console.error("Error fetching polygons:", err);
        res.status(500).send('Server error fetching polygons');
    }
});

app.get('/api/samples', async (req, res) => {
    res.json([]);
});

app.get('/api/categories', async (req, res) => {
    res.json([]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
