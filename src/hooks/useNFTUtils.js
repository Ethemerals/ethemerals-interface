import iconAssassin from '../assets/icon_assassin.svg';

import void1 from '../assets/backgrounds/void/1.jpg';
import void2 from '../assets/backgrounds/void/2.jpg';
import void3 from '../assets/backgrounds/void/3.jpg';
import void4 from '../assets/backgrounds/void/4.jpg';

import earth1 from '../assets/backgrounds/earth/1.jpg';
import earth2 from '../assets/backgrounds/earth/2.jpg';
import earth3 from '../assets/backgrounds/earth/3.jpg';
import earth4 from '../assets/backgrounds/earth/4.jpg';
import earth5 from '../assets/backgrounds/earth/5.jpg';

import fire1 from '../assets/backgrounds/fire/1.jpg';
import fire2 from '../assets/backgrounds/fire/2.jpg';
import fire3 from '../assets/backgrounds/fire/3.jpg';
import fire4 from '../assets/backgrounds/fire/4.jpg';

import water1 from '../assets/backgrounds/water/1.jpg';
import water2 from '../assets/backgrounds/water/2.jpg';
import water3 from '../assets/backgrounds/water/3.jpg';
import water4 from '../assets/backgrounds/water/4.jpg';
import water5 from '../assets/backgrounds/water/5.jpg';

import wind1 from '../assets/backgrounds/wind/1.jpg';
import wind2 from '../assets/backgrounds/wind/2.jpg';
import wind3 from '../assets/backgrounds/wind/3.jpg';
import wind4 from '../assets/backgrounds/wind/4.jpg';
import wind5 from '../assets/backgrounds/wind/5.jpg';
import wind6 from '../assets/backgrounds/wind/6.jpg';

const s3URL = 'https://ethemerals-media.s3.amazonaws.com/';

export const useNFTUtils = () => {
	const getBaseURL = (cmId) => {
		return `${s3URL}${cmId}_base.png`;
	};

	// 24
	const bgImages = [void1, void2, void3, void4, earth1, earth2, earth3, earth4, earth5, fire1, fire2, fire3, fire4, water1, water2, water3, water4, water5, wind1, wind2, wind3, wind4, wind5, wind6];
	const bgColors = [
		'#2b2b2b',
		'#5b636c',
		'#b2babe',
		'#c2ceda',
		'#36403a',
		'#486b51',
		'#207861',
		'#67a19c',
		'#92b884',
		'#804242',
		'#7d4a5e',
		'#97677b',
		'#886b79',
		'#2a4772',
		'#30699e',
		'#337c8e',
		'#97cfee',
		'#a0c9f4',
		'#9c56a2',
		'#8983c3',
		'#ad8dc5',
		'#c08ecc',
		'#c0a5df',
		'#b1aadb',
	];

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

	return { getBaseURL, getNFTImages, parseScore, getColorPalette, bgImages, bgColors };
};
