import axios from 'axios';

export const messageDiscord = async (uri, _data) => {
	try {
		const { data } = await axios.post(`${process.env.REACT_APP_API_MESSAGES}${uri}`, _data);
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
