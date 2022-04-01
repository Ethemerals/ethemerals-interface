const getAddresses = () => {
	const network = parseInt(process.env.REACT_APP_NETWORK);

	let addresses = {
		Ethemerals: '0xee8c0131aa6b66a2ce3cad6d2a039c1473a79a6d',
		EthemeralBurner: '0xDb128597CB3C4F4b1D3C739Dbb2c5350EA84BA0D',
		Equipables: '0x61493114836bb14dae7a57be93de2eee95327092',
		changeScoreAndRewards: '0x304287ace2c677d9051ada34e87f1b4495e5c35c',
		Art: '0x612ca32a8b0fbe1d6738dfd0fa65cf9b3f8da34d',
		BurnAddress: '0x13D8EE49CbA2Eb416584806b8D370Ff432fF5A03',
		// BATTLE
		EternalBattle: '0x169310e61e71ef5834ce5466c7155d8a90d15f1e',
		EternalBattleV2: '0x0a062800914b868df5836f755bfef04b64ca23c6',
		priceFeed: '0x04302ef1c51dff4625cdec79f4400342ad27f559',
		priceFeedV2: '0x04302ef1c51dff4625cdec79f4400342ad27f559',
		// LAYER 2
		MeralManager: '0xaa74accf2a56bff87c252592e0409371928d302a',
		Onsen: '0xdB405C016322F9BB24ceB8386BcFcA277adf5bCE',
		Wilds: '0x7D37289d70E6Ba0907760b6B8fc76C0c987a3efc',
	};

	// MAINNETS
	if (network === 4) {
		addresses.Ethemerals = '0xcdb47e685819638668ff736d1a2ae32b68e76ba5';
		addresses.EthemeralBurner = '0x3b3D085078E3dAEad342A89bb2A3C2B45bC18828';
		addresses.Equipables = '0xc2CD83998D5d76f64830fBd1Df2e8b221C4F31A2';
		addresses.changeScoreAndRewards = '0x304287ace2c677d9051ada34e87f1b4495e5c35c';
		addresses.BurnAddress = '0x88329f0ec14ee9a958f0538f78757bc7442cf464';
		// BATTLE
		addresses.EternalBattle = '0x883170aAcEB39a23642f5aAaab083F5684D3fFB1';
		addresses.EternalBattleV2 = '0x0a062800914b868df5836f755bfef04b64ca23c6';
		addresses.priceFeed = '0xfacC389A4777D0Cda098C0f2Af4e6deDD1Ddf1f4';
		addresses.priceFeedV2 = '0xfacC389A4777D0Cda098C0f2Af4e6deDD1Ddf1f4';
		// LAYER 2
		addresses.MeralManager = '0xaa74accf2a56bff87c252592e0409371928d302a';
		addresses.Onsen = '0xdB405C016322F9BB24ceB8386BcFcA277adf5bCE';
		addresses.Wilds = '0x7D37289d70E6Ba0907760b6B8fc76C0c987a3efc';
	}

	return { ...addresses };
};

const Addresses = getAddresses();

export { Addresses };
