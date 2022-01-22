const getAddresses = () => {
	const mainnet = process.env.REACT_APP_MAINNET;

	let addresses = {
		Ethemerals: '0xcdb47e685819638668ff736d1a2ae32b68e76ba5',
		Equipables: '0xc2CD83998D5d76f64830fBd1Df2e8b221C4F31A2',
		EternalBattle: '0x883170aAcEB39a23642f5aAaab083F5684D3fFB1',
		priceFeed: '0xfacC389A4777D0Cda098C0f2Af4e6deDD1Ddf1f4',
		changeScoreAndRewards: '0x304287ace2c677d9051ada34e87f1b4495e5c35c',
		EscrowL1: '0x52AD83F0aE762622eab23BF9A15508195d404ef5',
		MeralManager: '0x055f437a439caec49de34026e583528aae84d7af',
		Onsen: '0xdB405C016322F9BB24ceB8386BcFcA277adf5bCE',
		Wilds: '0x53779baa1887663e8Ff6B2DaAdFbC5c8Ea8C6E53',
	};

	// MAINNETS
	if (mainnet === '1') {
		addresses.Ethemerals = '0xee8c0131aa6b66a2ce3cad6d2a039c1473a79a6d';
		addresses.Equipables = '0x61493114836bb14dae7a57be93de2eee95327092';
		addresses.EternalBattle = '0x169310e61e71ef5834ce5466c7155d8a90d15f1e';
		addresses.priceFeed = '0x04302ef1c51dff4625cdec79f4400342ad27f559';
		addresses.changeScoreAndRewards = '0x304287ace2c677d9051ada34e87f1b4495e5c35c';
		addresses.EscrowL1 = '0x691ac8428BBD2Cf1e9e88Fe11CEE6E3a542Db28B';
		addresses.MeralManager = '0x055F437a439CaEC49De34026e583528aae84d7aF';
		addresses.Onsen = '0xdB405C016322F9BB24ceB8386BcFcA277adf5bCE';
		addresses.Wilds = '0x53779baa1887663e8Ff6B2DaAdFbC5c8Ea8C6E53';
	}

	return { ...addresses };
};

const Addresses = getAddresses();

export { Addresses };
