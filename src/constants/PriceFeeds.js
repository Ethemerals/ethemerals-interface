const PriceFeeds = [];

PriceFeeds.push({
	ticker: 'ETH/USD',
	price: '1',
	id: 0,
	baseName: 'Ethereum',
	quoteName: 'US Dollar',
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
	quoteName: 'US Dollar',
	baseSymbol: 'BTC',
	quoteSymbol: 'USD',
	decimals: 8,
	decimalPlaces: 2,
});

export default PriceFeeds;
