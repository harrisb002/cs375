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
    console.log("[server.js] MongoDB Connected");
}).catch(err => console.error("[server.js] MongoDB connection error:", err));

const polygonSchema = new mongoose.Schema({
    sample_num: Number,
    coordinates: [[Number]] // array of [lng, lat] pairs
});

const Polygon = mongoose.model('Polygon', polygonSchema);

// Predictions schema
const predictionSchema = new mongoose.Schema({
    sample_num: Number,
    ground_truth: Number,
    predicted_label: Number,
    ground_truth_label: String,
    predicted_label_name: String
});

const Prediction = mongoose.model('Prediction', predictionSchema);

const sampleSchema = new mongoose.Schema({
    Sample_num: Number,
    // ... all the frq fields
}, { collection: 'samples' });

const Sample = mongoose.model('Sample', sampleSchema);

// Updated /api/polygons route
app.get('/api/polygons', async (req, res) => {
    try {
        console.log("[/api/polygons] Fetching polygons");
        const polygons = await Polygon.find({});
        const sampleNums = polygons.map(p => p.sample_num);
        const predictions = await Prediction.find({ sample_num: { $in: sampleNums } });

        // Create a map from sample_num to prediction object
        const predictionMap = predictions.reduce((acc, pred) => {
            acc[pred.sample_num] = pred;
            return acc;
        }, {});

        // Combine polygons with their corresponding predictions
        const polygonsWithPredictions = polygons.map(p => {
            const pred = predictionMap[p.sample_num] || {};
            return {
                ...p.toObject(),
                ground_truth_label: pred.ground_truth_label || null,
                predicted_label_name: pred.predicted_label_name || null,
                ground_truth: pred.ground_truth || null,
                predicted_label: pred.predicted_label || null
            };
        });

        console.log("[/api/polygons] Returning polygonsWithPredictions length:", polygonsWithPredictions.length);
        res.json(polygonsWithPredictions);
    } catch (error) {
        console.error("[/api/polygons] Error fetching polygons with predictions:", error);
        res.status(500).send('Server error fetching polygons with predictions');
    }
});

app.get('/api/samples', async (req, res) => {
    try {
        const sampleNums = req.query.sample_nums ? req.query.sample_nums.split(',').map(n => parseInt(n)) : [];
        const limit = parseInt(req.query.limit) || 1000;    // default to 1000
        const skip = parseInt(req.query.skip) || 0;

        console.log("[/api/samples] Requested sample_nums:", sampleNums);

        let docs;
        if (!sampleNums.length) {
            // If no sample_nums specified, return a limited set
            docs = await Sample.find({}).limit(limit).skip(skip).lean();
        } else {
            docs = await Sample.find({ Sample_num: { $in: sampleNums } }).lean();
        }

        console.log("[/api/samples] Samples returned:", docs.length);
        res.json(docs);
    } catch (error) {
        console.error("[/api/samples] Error fetching samples:", error);
        res.status(500).send('Server error fetching samples');
    }
});


app.get('/api/predictions', async (req, res) => {
    try {
        console.log("[/api/predictions] Fetching predictions");
        const predictions = await Prediction.find({});
        console.log("[/api/predictions] Predictions returned:", predictions.length);
        res.json(predictions);
    } catch (error) {
        console.error("[/api/predictions] Error fetching predictions:", error);
        res.status(500).send('Server error fetching predictions');
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`[server.js] Server running on port ${PORT}`));
