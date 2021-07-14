const s3URL = 'https://ethemerals-media.s3.amazonaws.com/';

export const useImages = () => {
	const getBaseURL = (cmId) => {
		return `${s3URL}${cmId}_base.png`;
	};

	return { getBaseURL };
};
