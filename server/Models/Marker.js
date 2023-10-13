const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
	name: String,
	description: String,
	longitude: {
		type: Number,
		required: true,
	},
	latitude: {
		type: Number,
		required: true,
	},
	showPopup: {
		type: Boolean,
		default: false,
	},
});

const Marker = mongoose.model('Marker', markerSchema);

module.exports = Marker;
