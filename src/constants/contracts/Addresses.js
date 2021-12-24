const getAddresses = () => {
	const network = process.env.REACT_APP_NETWORK;

	if (network === '1') {
		return {
			EthemeralLifeForce: '0x5900f8d3d9fc8425c6dc22b5bda71a1e0e594135',
			Ethemerals: '0xee8c0131aa6b66a2ce3cad6d2a039c1473a79a6d',
			Equipables: '0x61493114836bb14dae7a57be93de2eee95327092',
			Art: '0x612ca32a8B0Fbe1D6738dFd0FA65CF9b3f8DA34D',
			EternalBattle: '0x169310e61e71ef5834ce5466c7155d8a90d15f1e',
			priceFeed: '0x04302ef1c51dff4625cdec79f4400342ad27f559',
			changeScoreAndRewards: '0x304287ace2c677d9051ada34e87f1b4495e5c35c',
		};
	}

	if (network === '4') {
		return {
			EthemeralLifeForce: '0x22b56e6687e6b4ea8dd58b468ee3913cfa4185e3',
			Ethemerals: '0xcdb47e685819638668ff736d1a2ae32b68e76ba5',
			Equipables: '0xc2CD83998D5d76f64830fBd1Df2e8b221C4F31A2',
			Art: '0x612ca32a8b0fbe1d6738dfd0fa65cf9b3f8da34d',
			EternalBattle: '0x883170aAcEB39a23642f5aAaab083F5684D3fFB1',
			priceFeed: '0xfacC389A4777D0Cda098C0f2Af4e6deDD1Ddf1f4',
			changeScoreAndRewards: '0x074350b6490D86BDCC11b1278D6f8D41c69126e3',
			wilds: '0xBaFE3711886F335f02E71096f0723d658E04Ce0C',
		};
	}
};

const Addresses = getAddresses();

export { Addresses };
