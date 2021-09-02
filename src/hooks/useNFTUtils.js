// import iconAssassin from '../assets/icon_assassin.svg';

import iconAssassin from '../assets/subclasses/assassin.png';
import iconBerserker from '../assets/subclasses/berserker.png';
import iconCleric from '../assets/subclasses/cleric.png';
import iconDarkKnight from '../assets/subclasses/darkknight.png';
import iconDragoon from '../assets/subclasses/dragoon.png';
import iconDruid from '../assets/subclasses/druid.png';
import iconKnight from '../assets/subclasses/knight.png';
import iconMonk from '../assets/subclasses/monk.png';
import iconPaladin from '../assets/subclasses/paladin.png';
import iconRanger from '../assets/subclasses/ranger.png';
import iconSorcerer from '../assets/subclasses/sorcerer.png';
import iconSummoner from '../assets/subclasses/summoner.png';

import void1 from '../assets/backgrounds/void/1.jpg';
import void2 from '../assets/backgrounds/void/2.jpg';
import void3 from '../assets/backgrounds/void/3.jpg';
import void4 from '../assets/backgrounds/void/4.jpg';
import void5 from '../assets/backgrounds/void/5.jpg';

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

	// 25
	const elements = [
		{ element: 'Void R1', img: void1, color: 'hsl(0, 0%, 17%)', color1: 'hsl(0, 0%, 17%, 0.8)' },
		{ element: 'Void R2', img: void2, color: 'hsl(226, 14%, 24%)', color1: 'hsl(226, 14%, 12%, 0.8)' },
		{ element: 'Void R3', img: void3, color: 'hsl(212, 9%, 39%)', color1: 'hsl(212, 9%, 20%, 0.8)' },
		{ element: 'Void R4', img: void4, color: 'hsl(200, 8%, 72%)', color1: 'hsl(200, 8%, 35%, 0.8)' },
		{ element: 'Void R5', img: void5, color: 'hsl(210, 24%, 81%)', color1: 'hsl(210, 24%, 40%, 0.8)' },
		{ element: 'Earth R1', img: earth1, color: 'hsl(144, 8%, 23%)', color1: 'hsl(144, 8%, 11%, 0.8)' },
		{ element: 'Earth R2', img: earth2, color: 'hsl(135, 20%, 35%)', color1: 'hsl(135, 20%, 17%, 0.8)' },
		{ element: 'Earth R3', img: earth3, color: 'hsl(164, 58%, 30%)', color1: 'hsl(164, 58%, 15%, 0.8)' },
		{ element: 'Earth R4', img: earth4, color: 'hsl(175, 24%, 52%)', color1: 'hsl(175, 24%, 26%, 0.8)' },
		{ element: 'Earth R5', img: earth5, color: 'hsl(104, 27%, 62%)', color1: 'hsl(104, 27%, 31%, 0.8)' },
		{ element: 'Fire R1', img: fire1, color: 'hsl(0, 32%, 38%)', color1: 'hsl(0, 32%, 20%, 0.8)' },
		{ element: 'Fire R2', img: fire2, color: 'hsl(336, 26%, 39%)', color1: 'hsl(336, 26%, 20%, 0.8)' },
		{ element: 'Fire R3', img: fire3, color: 'hsl(335, 19%, 50%)', color1: 'hsl(335, 19%, 25%, 0.8)' },
		{ element: 'Fire R4', img: fire4, color: 'hsl(331, 12%, 48%)', color1: 'hsl(331, 12%, 25%, 0.8)' },
		{ element: 'Water R1', img: water1, color: 'hsl(216, 46%, 31%)', color1: 'hsl(216, 46%, 15%, 0.8)' },
		{ element: 'Water R2', img: water2, color: 'hsl(209, 53%, 40%)', color1: 'hsl(209, 53%, 20%, 0.8)' },
		{ element: 'Water R3', img: water3, color: 'hsl(192, 47%, 38%)', color1: 'hsl(192, 47%, 20%, 0.8)' },
		{ element: 'Water R4', img: water4, color: 'hsl(201, 72%, 76%)', color1: 'hsl(201, 72%, 40%, 0.8)' },
		{ element: 'Water R5', img: water5, color: 'hsl(211, 79%, 79%)', color1: 'hsl(211, 79%, 40%, 0.8)' },
		{ element: 'Wind R1', img: wind1, color: 'hsl(295, 31%, 49%)', color1: 'hsl(295, 31%, 25%, 0.8)' },
		{ element: 'Wind R2', img: wind2, color: 'hsl(246, 35%, 64%)', color1: 'hsl(246, 35%, 32%, 0.8)' },
		{ element: 'Wind R3', img: wind3, color: 'hsl(274, 33%, 66%)', color1: 'hsl(274, 33%, 33%, 0.8)' },
		{ element: 'Wind R4', img: wind4, color: 'hsl(288, 38%, 68%)', color1: 'hsl(288, 38%, 34%, 0.8)' },
		{ element: 'Wind R5', img: wind5, color: 'hsl(268, 48%, 76%)', color1: 'hsl(268, 48%, 38%, 0.8)' },
		{ element: 'Wind R6', img: wind6, color: 'hsl(249, 40%, 76%)', color1: 'hsl(249, 40%, 38%, 0.8)' }, // END
	];

	const getNFTImages = (cmId) => {
		let base = `${s3URL}${cmId}_base.png`;
		let large = `${s3URL}${cmId}_large.png`;
		let preview = `${s3URL}${cmId}_preview.png`;
		let inventory = `${s3URL}${cmId}_inventory.png`;
		let thumbnail = `${s3URL}${cmId}_thumbnail.png`;
		let subclassIcon = iconAssassin;
		return { base, large, subclassIcon, preview, inventory, thumbnail };
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

	function getSubclassIcon(subclass) {
		let icon = iconPaladin;
		let palette = { base: 'hsla(194,0%,90%,1)' };

		if (subclass === 'Paladin') {
			icon = iconPaladin;
			palette.hue = 194;
		}
		if (subclass === 'Knight') {
			icon = iconKnight;
			palette.hue = 205;
		}
		if (subclass === 'Dark Knight') {
			icon = iconDarkKnight;
			palette.hue = 220;
		}
		if (subclass === 'Dragoon') {
			icon = iconDragoon;
			palette.hue = 235;
		}

		if (subclass === 'Sorcerer') {
			icon = iconSorcerer;
			palette.hue = 277;
		}
		if (subclass === 'Summoner') {
			icon = iconSummoner;
			palette.hue = 295;
		}
		if (subclass === 'Cleric') {
			icon = iconCleric;
			palette.hue = 317;
		}
		if (subclass === 'Druid') {
			icon = iconDruid;
			palette.hue = 338;
		}

		if (subclass === 'Ranger') {
			icon = iconRanger;
			palette.hue = 115;
		}
		if (subclass === 'Berserker') {
			icon = iconBerserker;
			palette.hue = 133;
		}
		if (subclass === 'Assassin') {
			icon = iconAssassin;
			palette.hue = 155;
		}
		if (subclass === 'Monk') {
			icon = iconMonk;
			palette.hue = 176;
		}

		return { icon, palette };
	}

	function getSubclassPalette(subclass) {
		let palette = { base: 'hsla(194,0%,90%,1)' };

		if (subclass === 'Paladin') {
			palette.hue = 194;
		}
		if (subclass === 'Knight') {
			palette.hue = 205;
		}
		if (subclass === 'Dark Knight') {
			palette.hue = 220;
		}
		if (subclass === 'Dragoon') {
			palette.hue = 235;
		}

		if (subclass === 'Sorcerer') {
			palette.hue = 277;
		}
		if (subclass === 'Summoner') {
			palette.hue = 295;
		}
		if (subclass === 'Cleric') {
			palette.hue = 317;
		}
		if (subclass === 'Druid') {
			palette.hue = 338;
		}

		if (subclass === 'Ranger') {
			palette.hue = 115;
		}
		if (subclass === 'Berserker') {
			palette.hue = 133;
		}
		if (subclass === 'Assassin') {
			palette.hue = 155;
		}
		if (subclass === 'Monk') {
			palette.hue = 176;
		}

		return palette;
	}

	const getSubclassBonus = (subclass) => {
		let bonus = [0, 0, 0];

		if (subclass === 'Paladin') {
			bonus = [0, 20, 0];
		}
		if (subclass === 'Knight') {
			bonus = [5, 15, 0];
		}
		if (subclass === 'Dark Knight') {
			bonus = [15, 5, 0];
		}
		if (subclass === 'Dragoon') {
			bonus = [10, 5, 5];
		}

		if (subclass === 'Sorcerer') {
			bonus = [20, 0, 0];
		}
		if (subclass === 'Summoner') {
			bonus = [10, 10, 0];
		}
		if (subclass === 'Cleric') {
			bonus = [0, 16, 4];
		}
		if (subclass === 'Druid') {
			bonus = [7, 6, 7];
		}

		if (subclass === 'Ranger') {
			bonus = [0, 0, 20];
		}
		if (subclass === 'Berserker') {
			bonus = [10, 0, 10];
		}
		if (subclass === 'Assassin') {
			bonus = [12, 0, 8];
		}
		if (subclass === 'Monk') {
			bonus = [4, 8, 8];
		}

		return bonus;
	};

	return { getBaseURL, getNFTImages, parseScore, getSubclassPalette, getSubclassIcon, elements, getSubclassBonus };
};
