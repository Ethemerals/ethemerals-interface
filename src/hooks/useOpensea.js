import axios from 'axios';
import { Addresses } from '../constants/contracts/Addresses';

export const refreshMetadata = async (id) => {
	let baseUrl = `https://api.opensea.io/api/v1/asset/${Addresses.Ethemerals}/`;
	if (parseInt(process.env.REACT_APP_NETWORK) === 4) {
		baseUrl = `https://rinkeby-api.opensea.io/api/v1/asset/${Addresses.Ethemerals}/`;
	}
	let apiBaseUrl = `${process.env.REACT_APP_API_URL}`;

	try {
		// update image
		await axios.get(`${apiBaseUrl}image/${id}`);
		const response = await axios.get(`${baseUrl}${id}/?force_update=true`);
		if (response.data) {
			return { success: true, data: response.data };
		}
	} catch (error) {
		console.log(error);
		return { success: false, data: null };
	}
};
