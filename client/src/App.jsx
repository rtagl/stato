import { useEffect, useState } from 'react';
import Map, { Marker, GeocoderControl } from 'react-map-gl';
import axios from 'axios';
import pin from '/map-pin.svg';
import markerService from './services/markerService';

// Components
import Popup from './components/Popup';

const baseUrl = 'http://localhost:3001';

const fetchData = () => {
	const response = markerService.getAll();
	return response;
};

const fogDetails = {
	range: [0.8, 8],
	color: '#dc9f9f',
	'horizon-blend': 0.5,
	'high-color': '#245bde',
	'space-color': '#000000',
	'star-intensity': 0.15,
};

function App() {
	const [markers, setMarkers] = useState([]);

	useEffect(() => {
		fetchData().then((data) => setMarkers(data));
	}, []);

	const handleNewMarker = async (e) => {
		const { lngLat } = e;
		const newMarker = {
			longitude: lngLat.lng,
			latitude: lngLat.lat,
			showPopup: true,
		};
		const savedMarker = await axios.post(`${baseUrl}/api/markers`, newMarker);
		setMarkers([...markers, savedMarker.data]);
	};

	const handleTogglePopup = async (marker) => {
		const updatedMarker = await axios.put(`${baseUrl}/api/markers/${marker._id}`, {
			showPopup: !marker.showPopup,
		});
		setMarkers(markers.map((m) => (m._id === marker._id ? updatedMarker.data : m)));
	};

	const handleDeleteMarker = async (markerId) => {
		try {
			const deletedMarker = await markerService.deleteMarker(markerId);
			console.log(`deleted marker ${deletedMarker._id}`);
			setMarkers(markers.filter((marker) => marker._id !== markerId));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Map
				mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
				initialViewState={{
					longitude: -122.4,
					latitude: 37.8,
					zoom: 1,
				}}
				fog={fogDetails}
				doubleClickZoom={false}
				onDblClick={(e) => handleNewMarker(e)}
				style={{ width: '100vw', height: '100vh' }}
				mapStyle="mapbox://styles/mapbox/satellite-v9"
				projection="globe">
				<GeocoderControl
					mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
					position="top-left"
				/>
				{markers.map((marker) => (
					<div key={marker._id}>
						<Marker
							longitude={marker.longitude}
							latitude={marker.latitude}
							anchor="bottom"
							onClick={() => handleTogglePopup(marker)}>
							<img src={pin} alt="" />
						</Marker>
						{marker.showPopup && (
							<Popup
								marker={marker}
								handleTogglePopup={handleTogglePopup}
								handleDeleteMarker={handleDeleteMarker}
							/>
						)}
					</div>
				))}
			</Map>
		</>
	);
}

export default App;
