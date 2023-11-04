import axios from 'axios';

const API_URL = 'http://localhost:3001/api/markers';

const getAll = async () => {
	const response = await axios.get(API_URL);
	return response.data;
};

const deleteMarker = async (id) => {
	const response = await axios.delete(`${API_URL}/${id}`);
	return response.data;
};

export default {
	getAll,
	deleteMarker,
};
