const PriceFeedsL2 = [
	{
		ticker: 'ETH / USD',
		price: '1',
		id: 1,
		baseName: 'Ethereum',
		quoteName: 'US Dollar',
		baseSymbol: 'ETH',
		quoteSymbol: 'USD',
		decimals: 8,
		priceDecimalPlaces: 2,
		volDecimalPlaces: 0,
		cmId: 1027,
		chainlink: 'https://data.chain.link/polygon/mainnet/crypto-usd/eth-usd',
		coingecko: 'https://www.coingecko.com/en/coins/ethereum',
		bonusLongs: [{ cmId: 1027, name: 'Ethereum' }],
		bonusShorts: [
			{ cmId: 825, name: 'Tether' },
			{ cmId: 3408, name: 'USDC' },
			{ cmId: 4687, name: 'BUSD' },
			{ cmId: 7129, name: 'TerraUSD' },
			{ cmId: 2563, name: 'TrueUSD' },
			{ cmId: 4943, name: 'Dai' },
		],
	},
	{
		ticker: 'BTC / USD',
		price: '1',
		id: 2,
		baseName: 'Bitcoin',
		quoteName: 'US Dollar',
		baseSymbol: 'BTC',
		quoteSymbol: 'USD',
		decimals: 8,
		priceDecimalPlaces: 0,
		volDecimalPlaces: 0,
		cmId: 1,
		chainlink: 'https://data.chain.link/polygon/mainnet/crypto-usd/btc-usd',
		coingecko: 'https://www.coingecko.com/en/coins/bitcoin',
		bonusLongs: [
			{ cmId: 1, name: 'Bitcoin' },
			{ cmId: 3717, name: 'WBTC' },
			{ cmId: 4023, name: 'Bitcoin BEP2' },
		],
		bonusShorts: [
			{ cmId: 825, name: 'Tether' },
			{ cmId: 3408, name: 'USDC' },
			{ cmId: 4687, name: 'BUSD' },
			{ cmId: 7129, name: 'TerraUSD' },
			{ cmId: 2563, name: 'TrueUSD' },
			{ cmId: 4943, name: 'Dai' },
		],
	},
];

export const getPriceFeeds = () => {
	return PriceFeedsL2.map((feed) => {
		feed.logo = `https://s2.coinmarketcap.com/static/img/coins/64x64/${feed.cmId}.png`;
		feed.bonusLongs.forEach((bonus) => {
			bonus.logo = `https://s2.coinmarketcap.com/static/img/coins/64x64/${bonus.cmId}.png`;
		});
		feed.bonusShorts.forEach((bonus) => {
			bonus.logo = `https://s2.coinmarketcap.com/static/img/coins/64x64/${bonus.cmId}.png`;
		});
		return feed;
	});
};
