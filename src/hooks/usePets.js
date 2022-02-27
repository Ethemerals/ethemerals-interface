import { Links } from '../constants/Links';

export const getPetBorderColor = (rarity) => {
	if (rarity === 5) {
		return 'hsla(280, 40%, 60%, 1)';
	}
	if (rarity === 4) {
		return 'hsla(24, 40%, 60%, 1)';
	}
	if (rarity === 3) {
		return 'hsla(223, 40%, 60%, 1)';
	}
	if (rarity === 2) {
		return 'hsla(129, 40%, 60%, 1)';
	}

	return 'hsla(225, 10%, 60%, 1)';
};

export const getPetTypePallet = (nft) => {
	let subclass = getType(nft);
	let palette;
	if (subclass === 0) {
		palette = 'hsla(360,80%,40%,1)';
	}
	if (subclass === 1) {
		palette = 'hsla(220,80%,40%,1)';
	}
	if (subclass === 2) {
		palette = 'hsla(160,80%,40%,1)';
	}
	return palette;
};

export const getPetImages = (baseId) => {
	let base = `${Links.BUCKET}${baseId}_equipment_base.png`;
	let preview = `${Links.BUCKET}${baseId}_equipment_preview.png`;
	let thumbnail = `${Links.BUCKET}${baseId}_equipment_thumbnail.png`;
	return { base, preview, thumbnail };
};

export const getType = (nft) => {
	let stats = [nft.atk, nft.def, nft.spd];
	return stats.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
};
