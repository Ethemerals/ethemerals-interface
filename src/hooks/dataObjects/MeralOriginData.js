import Moralis from 'moralis';
import { getIdFromType } from '../useMeralUtils';
import { getSubclassInfo } from '../useNFTUtils';

export const MeralOriginData = Moralis.Object.extend('MeralOriginData', {
	getEdition: function () {
		return this.get('edition');
	},
	getCreator: function () {
		return this.get('creator');
	},
	getCreationTimestamp: function () {
		return this.get('creation_timestamp');
	},
	getIds: function () {
		let tokenId = this.get('tokenId');
		let meralId = this.get('meralId');
		let type = this.get('type');
		return { tokenId, meralId, type };
	},
	getClass: function () {
		let coin = this.get('coin');
		let subclass = this.get('subclass');
		let element = this.get('element');
		let mainclass = parseInt(Math.floor(subclass / 4));
		return { coin, subclass, element, mainclass };
	},
	getStats: function () {
		let atk = this.get('atk');
		let def = this.get('def');
		let spd = this.get('spd');
		let hp = this.get('hp');
		let maxHp = this.get('maxHp');
		let maxStamina = this.get('maxStamina');
		let xp = this.get('xp');
		let elf = this.get('elf');
		let ready = true;
		if (!hp) {
			ready = false;
		}
		return { atk, def, spd, hp, maxHp, maxStamina, xp, elf, ready };
	},
	getArtist: function () {
		return this.get('artist');
	},
	getOwner: function () {
		return this.get('owner');
	},
	getPreviousOwner: function () {
		return this.get('previousOwner');
	},
	getCurrentColor: function () {
		return this.get('currentColor');
	},
	getColors: function () {
		return this.get('colors');
	},
	getIsColorUnlocked: function (col) {
		const colors = this.get('colors');
		return colors[col].unlocked;
	},
	getMeralName: function () {
		return this.get('meralName');
	},
});

const parseMerals = async (meralData) => {
	let subclass = meralData.get('subclass');
	let name = meralData.get('meralName');
	let coin = meralData.get('coin');

	if (!name) {
		name = '';
	}
	if (!coin) {
		coin = '';
	}

	if (coin && !name) {
		name = coin;
	}

	let meral = {
		edition: meralData.get('edition'),
		owner: meralData.get('owner'),
		tokenId: parseInt(meralData.get('tokenId')),
		meralId: meralData.get('meralId'),
		type: meralData.get('type'),
		name: name,
		coin: coin,
		hp: meralData.get('hp'),
		elf: meralData.get('elf'),
		xp: meralData.get('xp'),
		atk: meralData.get('atk'),
		def: meralData.get('def'),
		spd: meralData.get('spd'),
		element: meralData.get('element'),
		cmId: meralData.get('cmId'),
		previousOwner: meralData.get('previousOwner'),
		transferTimestamp: meralData.get('transferTimestamp'),
		mainclass: Math.floor(subclass / 4),
		subclass: subclass,
		subclassInfo: getSubclassInfo(subclass),
		currentColor: meralData.get('currentColor'),
		petRedeemed: meralData.get('petRedeemed'),
		colors: meralData.get('colors'),
		creationTimestamp: meralData.get('creationTimestamp'),
		artist: meralData.get('artist'),
		creator: meralData.get('creator'),
	};

	return meral;
};

export const getMeralOriginDataById = async (id) => {
	const query = new Moralis.Query(MeralOriginData);
	query.equalTo('meralId', parseInt(id));
	const results = await query.find();
	if (results.length > 0) {
		let meral = await parseMerals(results[0]);
		return meral;
	} else {
		return null;
	}
};

export const getMeralOriginDataByTokenId = async (type, tokenId) => {
	const query = new Moralis.Query(MeralOriginData);
	query.equalTo('meralId', parseInt(getIdFromType(type, tokenId)));
	const results = await query.find();
	if (results.length > 0) {
		let meral = await parseMerals(results[0]);
		return meral;
	} else {
		return null;
	}
};
