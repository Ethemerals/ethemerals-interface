const PriceFeedsL2 = [
	{
		ticker: 'ETH / USD',
		price: '1',
		id: 0,
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
	},
	{
		ticker: 'BTC / USD',
		price: '1',
		id: 1,
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
	},
];

export const getPriceFeeds = () => {
	return PriceFeedsL2.map((feed) => {
		feed.logo = `https://s2.coinmarketcap.com/static/img/coins/64x64/${feed.cmId}.png`;
		return feed;
	});
};
