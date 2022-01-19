import { useState, useEffect } from 'react';
import { useChain } from 'react-moralis';

const Addresses = [
	{
		key: '0x1',
		value: 'Ethereum',
		addresses: {
			Ethemerals: '0xee8c0131aa6b66a2ce3cad6d2a039c1473a79a6d',
			Equipables: '0x61493114836bb14dae7a57be93de2eee95327092',
			EternalBattle: '0x169310e61e71ef5834ce5466c7155d8a90d15f1e',
			priceFeed: '0x04302ef1c51dff4625cdec79f4400342ad27f559',
			EscrowL1: '0x691ac8428BBD2Cf1e9e88Fe11CEE6E3a542Db28B',
		},
	},
	{
		key: '0x89',
		value: 'Polygon',
		addresses: {
			ELF: '0x22b56e6687e6b4ea8dd58b468ee3913cfa4185e3',
			EthemeralsL2: '0x39E75603BF945E4402421F43C1d6E630E68E0dCA',
			Wilds: '0x53779baa1887663e8Ff6B2DaAdFbC5c8Ea8C6E53',
			Onsen: '0xe39d7C3C4Be47C8B08A03FA52683322aF6697FCD',
			MeralManager: '0xCbaAabB391140833419b3Adade77220084b84dB1',
		},
	},
	{
		key: '0x4',
		value: 'Rinkeby',
		addresses: {
			Ethemerals: '0xcdb47e685819638668ff736d1a2ae32b68e76ba5',
			Equipables: '0xc2CD83998D5d76f64830fBd1Df2e8b221C4F31A2',
			EternalBattle: '0x883170aAcEB39a23642f5aAaab083F5684D3fFB1',
			priceFeed: '0xfacC389A4777D0Cda098C0f2Af4e6deDD1Ddf1f4',
			EscrowL1: '0x52AD83F0aE762622eab23BF9A15508195d404ef5',
		},
	},
	{
		key: '0x13881',
		value: 'Mumbai',
		addresses: {
			ELF: '0x22b56e6687e6b4ea8dd58b468ee3913cfa4185e3',
			EthemeralsL2: '0x39E75603BF945E4402421F43C1d6E630E68E0dCA',
			Wilds: '0x53779baa1887663e8Ff6B2DaAdFbC5c8Ea8C6E53',
			Onsen: '0xe39d7C3C4Be47C8B08A03FA52683322aF6697FCD',
			MeralManager: '0xCbaAabB391140833419b3Adade77220084b84dB1',
		},
	},
];

export const useAddresses = () => {
	const { chainId } = useChain();
	const [addresses, setAddresses] = useState(undefined);

	useEffect(() => {
		let _chainId;
		if (chainId) {
			_chainId = chainId;
		} else {
			_chainId = '0x1';
		}

		const _addresses = Addresses.find((item) => item.key === _chainId);
		setAddresses(_addresses.addresses);

		return () => {
			setAddresses(undefined);
		};
	}, [chainId]);

	return { addresses };
};
