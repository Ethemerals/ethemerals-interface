import { Links } from '../constants/Links';

export const getPetBorderColor = (rarity) => {
	if (parseInt(rarity) === 5) {
		return 'hsla(280, 40%, 60%, 1)';
	}
	if (parseInt(rarity) === 4) {
		return 'hsla(24, 40%, 60%, 1)';
	}
	if (parseInt(rarity) === 3) {
		return 'hsla(223, 40%, 60%, 1)';
	}
	if (parseInt(rarity) === 2) {
		return 'hsla(129, 40%, 60%, 1)';
	}

	return 'hsla(225, 10%, 60%, 1)';
};

export const getPetTypePallet = (nft) => {
	let subclass = getType(nft);
	let palette;
	if (subclass === 0) {
		palette = 'hsla(360,50%,70%,1)';
	}
	if (subclass === 1) {
		palette = 'hsla(220,50%,70%,1)';
	}
	if (subclass === 2) {
		palette = 'hsla(160,50%,70%,1)';
	}
	return palette;
};

export const getPetImages = (baseId) => {
	let large = `${Links.BUCKET}pets/${baseId}_large.png`;
	let preview = `${Links.BUCKET}pets/${baseId}_preview.png`;
	return { large, preview };
};

export const getType = (nft) => {
	let stats = [nft.atk, nft.def, nft.spd];
	return stats.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
};
