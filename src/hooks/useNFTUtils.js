import iconAssassin from '../assets/icon_assassin.svg';
const s3URL = 'https://ethemerals-media.s3.amazonaws.com/';

export const useNFTUtils = () => {
	const getBaseURL = (cmId) => {
		return `${s3URL}${cmId}_base.png`;
	};

	const getNFTImages = (cmId) => {
		let base = `${s3URL}${cmId}_base.png`;
		let large = `${s3URL}${cmId}_large.png`;
		let preview = `${s3URL}${cmId}_preview.png`;
		let inventory = `${s3URL}${cmId}_inventory.png`;
		let thumbnail = `${s3URL}${cmId}_thumbnail.png`;
		let bg = `${s3URL}bg_texture.jpg`;
		let subclassIcon = iconAssassin;
		return { base, bg, large, subclassIcon, preview, inventory, thumbnail };
	};

	function parseScore(score) {
		let scoreInt = parseInt(score);
		// prettier-ignore
		if(scoreInt >= 980) { return 6}
		// prettier-ignore
		if(scoreInt >= 750) { return 5}
		// prettier-ignore
		if(scoreInt >= 500) { return 4}
		// prettier-ignore
		if(scoreInt >= 300) { return 3}
		// prettier-ignore
		if(scoreInt >= 100) { return 2}

		return 1;
	}

	return { getBaseURL, getNFTImages, parseScore };
};
