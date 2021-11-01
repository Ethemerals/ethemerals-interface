const PriceFeeds = [];

PriceFeeds.push({
	ticker: 'ETH/USD',
	price: '1',
	id: 0,
	baseName: 'Ethereum',
	quoteName: 'USD',
	baseSymbol: 'ETH',
	quoteSymbol: 'USD',
	decimals: 8,
	decimalPlaces: 2,
});

PriceFeeds.push({
	ticker: 'BTC/USD',
	price: '1',
	id: 1,
	baseName: 'Bitcoin',
	quoteName: 'USD',
	baseSymbol: 'BTC',
	quoteSymbol: 'USD',
	decimals: 8,
	decimalPlaces: 2,
});

export default PriceFeeds;
