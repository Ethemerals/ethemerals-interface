import Moralis from 'moralis';

export const Account = Moralis.Object.extend('Accounts', {
	getAddress: function () {
		return this.get('address');
	},
});

export const getAccount = async (address) => {
	console.log(address);
	const query = new Moralis.Query(Account);
	query.equalTo('address', address);
	const results = await query.find();
	if (results.length > 0) {
		return results[0];
	} else {
		return null;
	}
};

export const getAccountMerals = async (account) => {
	const relation = account.relation('merals');
	const query = relation.query();
	const results = await query.find();
	return results;
};
