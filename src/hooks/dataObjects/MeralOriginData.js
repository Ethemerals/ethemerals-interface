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
	getSubclassData: function () {
		let subclass = this.get('subclass');
		return getSubclassInfo(subclass);
	},
	getPetRedeemed: function () {
		return this.get('petRedeemed');
	},
	getMeralDetails: function () {
		return { ...this.getIds(), ...this.getClass(), ...this.getStats(), subclassInfo: this.getSubclassData(), owner: this.getOwner(), petRedeemed: this.getPetRedeemed() };
	},
});

export const getMeralOriginDataById = async (id) => {
	const query = new Moralis.Query(MeralOriginData);
	query.equalTo('meralId', parseInt(id));
	const results = await query.find();
	if (results.length > 0) {
		return results[0];
	} else {
		return null;
	}
};

export const getMeralOriginDataByTokenId = async (type, tokenId) => {
	const query = new Moralis.Query(MeralOriginData);
	query.equalTo('meralId', parseInt(getIdFromType(type, tokenId)));
	const results = await query.find();
	if (results.length > 0) {
		return results[0];
	} else {
		return null;
	}
};
