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

import iconAssassinB from '../assets/subclasses/big/assassin.png';
import iconBerserkerB from '../assets/subclasses/big/berserker.png';
import iconClericB from '../assets/subclasses/big/cleric.png';
import iconDarkKnightB from '../assets/subclasses/big/darkknight.png';
import iconDragoonB from '../assets/subclasses/big/dragoon.png';
import iconDruidB from '../assets/subclasses/big/druid.png';
import iconKnightB from '../assets/subclasses/big/knight.png';
import iconMonkB from '../assets/subclasses/big/monk.png';
import iconPaladinB from '../assets/subclasses/big/paladin.png';
import iconRangerB from '../assets/subclasses/big/ranger.png';
import iconSorcererB from '../assets/subclasses/big/sorcerer.png';
import iconSummonerB from '../assets/subclasses/big/summoner.png';

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
import { Links } from '../constants/Links';

const s3URL = Links.BUCKET;

export const useNFTUtils = () => {
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
		let base = {
			large: `${s3URL}${cmId}_large.png`,
			preview: `${s3URL}${cmId}_preview.png`,
			inventory: `${s3URL}${cmId}_inventory.png`,
			thumbnail: `${s3URL}${cmId}_thumbnail.png`,
		};
		let color2 = {
			large: `${s3URL}${cmId}_large_2.png`,
			preview: `${s3URL}${cmId}_preview_2.png`,
			inventory: `${s3URL}${cmId}_inventory_2.png`,
			thumbnail: `${s3URL}${cmId}_thumbnail_2.png`,
		};
		let color3 = {
			large: `${s3URL}${cmId}_large_3.png`,
			preview: `${s3URL}${cmId}_preview_3.png`,
			inventory: `${s3URL}${cmId}_inventory_3.png`,
			thumbnail: `${s3URL}${cmId}_thumbnail_3.png`,
		};
		let special = {
			large: `${s3URL}${cmId}_large_special.png`,
			preview: `${s3URL}${cmId}_preview_special.png`,
			inventory: `${s3URL}${cmId}_inventory_special.png`,
			thumbnail: `${s3URL}${cmId}_thumbnail_special.png`,
		};

		let colors = [base, color2, color3, special];

		let subclassIcon = iconAssassin;
		return { colors, subclassIcon };
	};

	return { getNFTImages, elements };
};

export const elementsToIds = (elements) => {
	let ids = [];
	elements.forEach((element) => {
		if (element === 'Void') {
			ids = ids.concat(['0', '1', '2', '3', '4']);
		}
		if (element === 'Earth') {
			ids = ids.concat(['5', '6', '7', '8', '9']);
		}
		if (element === 'Fire') {
			ids = ids.concat(['10', '11', '12', '13']);
		}
		if (element === 'Water') {
			ids = ids.concat(['14', '15', '16', '17', '18']);
		}
		if (element === 'Wind') {
			ids = ids.concat(['19', '20', '21', '22', '23', '24']);
		}
	});
	return ids;
};

export const subclassesToIds = (subclasses) => {
	let ids = [];
	subclasses.forEach((subclass) => {
		if (subclass === 'Paladin') {
			ids.push('0');
		}
		if (subclass === 'Knight') {
			ids.push('1');
		}
		if (subclass === 'Dark Knight') {
			ids.push('2');
		}
		if (subclass === 'Dragoon') {
			ids.push('3');
		}
		if (subclass === 'Sorcerer') {
			ids.push('4');
		}
		if (subclass === 'Summoner') {
			ids.push('5');
		}
		if (subclass === 'Cleric') {
			ids.push('6');
		}
		if (subclass === 'Druid') {
			ids.push('7');
		}
		if (subclass === 'Ranger') {
			ids.push('8');
		}
		if (subclass === 'Berserker') {
			ids.push('9');
		}
		if (subclass === 'Assassin') {
			ids.push('10');
		}
		if (subclass === 'Monk') {
			ids.push('11');
		}
	});
	return ids;
};

export const getSubclassInfo = (subclassInt) => {
	let subclasses = [
		{
			name: 'Paladin',
			bonus: { atk: 0, def: 200, spd: 0 },
			icon: iconPaladin,
			iconB: iconPaladinB,
			hue: 194,
		},
		{
			name: 'Knight',
			bonus: { atk: 50, def: 150, spd: 0 },
			icon: iconDarkKnight,
			iconB: iconDarkKnightB,
			hue: 220,
		},
		{
			name: 'Dark Knight',
			bonus: { atk: 150, def: 50, spd: 0 },
			icon: iconDarkKnight,
			iconB: iconDarkKnightB,
			hue: 220,
		},
		{
			name: 'Dragoon',
			bonus: { atk: 100, def: 50, spd: 50 },
			icon: iconDragoon,
			iconB: iconDragoonB,
			hue: 235,
		},
		{
			name: 'Sorcerer',
			bonus: { atk: 200, def: 0, spd: 0 },
			icon: iconSorcerer,
			iconB: iconSorcererB,
			hue: 277,
		},
		{
			name: 'Summoner',
			bonus: { atk: 100, def: 100, spd: 0 },
			icon: iconSummoner,
			iconB: iconSummonerB,
			hue: 295,
		},
		{
			name: 'Cleric',
			bonus: { atk: 0, def: 160, spd: 0 },
			icon: iconCleric,
			iconB: iconClericB,
			hue: 317,
		},
		{
			name: 'Druid',
			bonus: { atk: 70, def: 60, spd: 70 },
			icon: iconDruid,
			iconB: iconDruidB,
			hue: 338,
		},
		{
			name: 'Ranger',
			bonus: { atk: 0, def: 0, spd: 200 },
			icon: iconRanger,
			iconB: iconRangerB,
			hue: 115,
		},
		{
			name: 'Berserker',
			bonus: { atk: 0, def: 200, spd: 0 },
			icon: iconBerserker,
			iconB: iconBerserkerB,
			hue: 133,
		},
		{
			name: 'Assassin',
			bonus: { atk: 120, def: 0, spd: 80 },
			icon: iconAssassin,
			iconB: iconAssassinB,
			hue: 155,
		},
		{
			name: 'Monk',
			bonus: { atk: 40, def: 80, spd: 80 },
			icon: iconMonk,
			iconB: iconMonkB,
			hue: 176,
		},
	];

	return subclasses[subclassInt];
};

export const getSubclassBonus = (subclass) => {
	let bonus = [0, 0, 0];

	if (subclass === 'Paladin') {
		bonus = [0, 200, 0];
	}
	if (subclass === 'Knight') {
		bonus = [50, 150, 0];
	}
	if (subclass === 'Dark Knight') {
		bonus = [150, 50, 0];
	}
	if (subclass === 'Dragoon') {
		bonus = [100, 50, 50];
	}

	if (subclass === 'Sorcerer') {
		bonus = [200, 0, 0];
	}
	if (subclass === 'Summoner') {
		bonus = [100, 100, 0];
	}
	if (subclass === 'Cleric') {
		bonus = [0, 160, 40];
	}
	if (subclass === 'Druid') {
		bonus = [70, 60, 70];
	}

	if (subclass === 'Ranger') {
		bonus = [0, 0, 200];
	}
	if (subclass === 'Berserker') {
		bonus = [100, 0, 100];
	}
	if (subclass === 'Assassin') {
		bonus = [120, 0, 80];
	}
	if (subclass === 'Monk') {
		bonus = [40, 80, 80];
	}

	return bonus;
};
