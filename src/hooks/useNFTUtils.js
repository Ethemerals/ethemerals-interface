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

	function getColorPalette(subclass) {
		let palette = { base: 'hsla(194,35%,72%,1)' };

		if (subclass === 'Paladin') {
			palette.base = 'hsla(194,35%,72%,1)';
		}
		if (subclass === 'Knight') {
			palette.base = 'hsla(205,35%,72%,1)';
			console.log('KNIOGHTTT');
		}
		if (subclass === 'Dark Knight') {
			palette.base = 'hsla(220,35%,72%,1)';
		}
		if (subclass === 'Dragoon') {
			palette.base = 'hsla(235,35%,72%,1)';
		}

		if (subclass === 'Sorcerer') {
			palette.base = 'hsla(277,35%,72%,1)';
		}
		if (subclass === 'Summoner') {
			palette.base = 'hsla(295,35%,72%,1)';
		}
		if (subclass === 'Cleric') {
			palette.base = 'hsla(317,35%,72%,1)';
		}
		if (subclass === 'Druid') {
			palette.base = 'hsla(338,35%,72%,1)';
		}

		if (subclass === 'Ranger') {
			palette.base = 'hsla(115,35%,72%,1)';
		}
		if (subclass === 'Berserker') {
			palette.base = 'hsla(133,35%,72%,1)';
		}
		if (subclass === 'Assassin') {
			palette.base = 'hsla(155,35%,72%,1)';
		}
		if (subclass === 'Monk') {
			palette.base = 'hsla(176,35%,72%,1)';
		}

		return palette;
	}

	return { getBaseURL, getNFTImages, parseScore, getColorPalette };
};
