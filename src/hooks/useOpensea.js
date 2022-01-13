import axios from 'axios';

export const refreshMetadata = async (id) => {
	let baseUrl = `https://api.opensea.io/api/v1/asset/${process.env.REACT_APP_ETHEMERALS_ADDRESS}/`;
	if (process.env.REACT_APP_NETWORK === '4') {
		baseUrl = `https://rinkeby-api.opensea.io/api/v1/asset/${process.env.REACT_APP_ETHEMERALS_ADDRESS}/`;
	}
	let apiBaseUrl = `${process.env.REACT_APP_API_URL}`;

	try {
		// update image
		await axios.get(`${apiBaseUrl}image/${id}`);
		const response = await axios.get(`${baseUrl}${id}/?force_update=true`);
		console.log('here');
		if (response.data) {
			return { success: true, data: response.data };
		}
	} catch (error) {
		return { success: false, data: null };
	}
};
