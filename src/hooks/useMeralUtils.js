// POLY ID
const typeMult = 100000;
export const getTypeFromId = (id) => {
	return parseInt(parseInt(id) / typeMult);
};

export const getTokenIdFromId = (id) => {
	let type = getTypeFromId(id);
	return parseInt(parseInt(id) - parseInt(type) * typeMult);
};

export const getIdFromType = (type, tokenId) => {
	return parseInt(parseInt(tokenId) + parseInt(type) * typeMult);
};
