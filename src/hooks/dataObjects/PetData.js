import Moralis from 'moralis';

export const PetOriginData = Moralis.Object.extend('PetOriginData', {
	getPetData: function () {
		let owner = this.get('owner');
		let timestamp = this.get('creation_timestamp');
		let name = this.get('name');
		let tokenId = this.get('tokenId');
		let atk = this.get('atk');
		let def = this.get('def');
		let spd = this.get('spd');
		let rarity = this.get('rarity');
		let baseId = this.get('baseId');
		let mainclass = this.get('mainclass');
		return { owner, timestamp, name, tokenId, atk, def, spd, rarity, baseId, mainclass };
	},
});

export const getPetDataById = async (tokenId) => {
	const query = new Moralis.Query(PetOriginData);
	query.equalTo('tokenId', parseInt(tokenId));
	const results = await query.find();
	if (results.length > 0) {
		let result = await results[0].getPetData();
		return result;
	} else {
		return null;
	}
};
