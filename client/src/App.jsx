import { Fragment, useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import axios from 'axios';

const baseUrl = 'http://localhost:3001';

const fetchData = async () => {
	const response = await axios.get(`${baseUrl}/api/markers`);
	return response.data;
};

function App() {
	const [markers, setMarkers] = useState([]);

	useEffect(() => {
		fetchData().then((data) => {
			console.log('data', data);
			setMarkers(data);
		});
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

	const handleToggleMarker = async (marker) => {
		const updatedMarker = await axios.put(`${baseUrl}/api/markers/${marker._id}`, {
			showPopup: !marker.showPopup,
		});
		setMarkers(markers.map((m) => (m._id === marker._id ? updatedMarker.data : m)));
	};

	return (
		<>
			<Map
				mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
				initialViewState={{
					longitude: -122.4,
					latitude: 37.8,
					zoom: 8,
				}}
				doubleClickZoom={false}
				onDblClick={(e) => handleNewMarker(e)}
				style={{ width: '100vw', height: '100vh' }}
				mapStyle="mapbox://styles/mapbox/satellite-v9"
				projection="globe">
				{markers.map((marker) => (
					<Fragment key={marker._id}>
						<Marker
							longitude={marker.longitude}
							latitude={marker.latitude}
							anchor="bottom"
							onClick={() => handleToggleMarker(marker)}
						/>
						{marker.showPopup && (
							<Popup
								longitude={marker.longitude}
								latitude={marker.latitude}
								closeOnClick={false}
								offset={55}
								anchor="bottom">
								<button className="delete-btn">Delete</button>
							</Popup>
						)}
					</Fragment>
				))}
			</Map>
		</>
	);
}

export default App;
