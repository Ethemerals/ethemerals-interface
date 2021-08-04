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
		let palette = { base: 'hsla(194,0%,90%,1)' };

		if (subclass === 'Paladin') {
			palette.hue = 194;
			palette.base = 'hsla(194,100%,80%,1)';
		}
		if (subclass === 'Knight') {
			palette.hue = 205;
			palette.base = 'hsla(205,100%,80%,1)';
		}
		if (subclass === 'Dark Knight') {
			palette.hue = 220;
			palette.base = 'hsla(220,100%,80%,1)';
		}
		if (subclass === 'Dragoon') {
			palette.hue = 235;
			palette.base = 'hsla(235,100%,80%,1)';
		}

		if (subclass === 'Sorcerer') {
			palette.hue = 277;
			palette.base = 'hsla(277,100%,80%,1)';
		}
		if (subclass === 'Summoner') {
			palette.hue = 295;
			palette.base = 'hsla(295,100%,80%,1)';
		}
		if (subclass === 'Cleric') {
			palette.hue = 317;
			palette.base = 'hsla(317,100%,80%,1)';
		}
		if (subclass === 'Druid') {
			palette.hue = 338;
			palette.base = 'hsla(338,100%,80%,1)';
		}

		if (subclass === 'Ranger') {
			palette.hue = 115;
			palette.base = 'hsla(115,100%,80%,1)';
		}
		if (subclass === 'Berserker') {
			palette.hue = 133;
			palette.base = 'hsla(133,100%,80%,1)';
		}
		if (subclass === 'Assassin') {
			palette.hue = 155;
			palette.base = 'hsla(155,100%,80%,1)';
		}
		if (subclass === 'Monk') {
			palette.hue = 176;
			palette.base = 'hsla(176,100%,80%,1)';
		}

		return palette;
	}

	return { getBaseURL, getNFTImages, parseScore, getColorPalette };
};
