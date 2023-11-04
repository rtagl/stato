import { Popup } from 'react-map-gl';
import PropTypes from 'prop-types';

const MarkerPopup = ({ marker, handleDeleteMarker, handleTogglePopup }) => {
	return (
		<Popup
			longitude={marker.longitude}
			latitude={marker.latitude}
			onClose={() => handleTogglePopup(marker)}
			closeOnClick={false}
			offset={55}
			anchor="bottom">
			<button onClick={() => handleDeleteMarker(marker._id)} className="delete-btn">
				Delete
			</button>
		</Popup>
	);
};

MarkerPopup.propTypes = {
	marker: PropTypes.object.isRequired,
	handleTogglePopup: PropTypes.func.isRequired,
	handleDeleteMarker: PropTypes.func.isRequired,
};

export default MarkerPopup;
