require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Marker = require('./Models/Marker');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

app.get('/api/markers', async (req, res) => {
	const markers = await Marker.find({});
	res.send(markers);
});

app.post('/api/markers', async (req, res) => {
	const body = req.body;
	try {
		const marker = await new Marker({
			name: body.name,
			showPopup: body.showPopup,
			description: body.description,
			longitude: body.longitude,
			latitude: body.latitude,
		});

		const savedMarker = await marker.save();
		console.log(savedMarker);
		res.send(savedMarker);
	} catch (error) {
		console.log('error', error);
		res.status(500).json({ error: error });
	}
});

app.put('/api/markers/:id', async (req, res) => {
	const body = req.body;
	const id = req.params.id;
	try {
		const marker = await Marker.findById(id);
		console.log(marker);
		marker.showPopup = body.showPopup;
		const savedMarker = await marker.save();
		console.log(savedMarker);
		res.send(savedMarker);
	} catch (error) {
		console.log('error', error);
		res.status(500).json({ error: error });
	}
});

app.delete('/api/markers/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const deletedMarker = await Marker.findByIdAndDelete(id);
		res.status(200).send(deletedMarker);
	} catch (error) {
		res.status(404).json({ error: error });
	}
});

const port = 3001;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
