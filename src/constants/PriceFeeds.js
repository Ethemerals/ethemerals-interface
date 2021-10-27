const PriceFeeds = [];

PriceFeeds.push({
	ticker: 'ETH/USD',
	price: '1',
	id: 0,
	baseName: 'Ethereum',
	quoteName: 'USDT',
	baseSymbol: 'ETH',
	quoteSymbol: 'USDT',
	decimals: 8,
	decimalPlaces: 2,
});

PriceFeeds.push({
	ticker: 'BTC/USD',
	price: '1',
	id: 1,
	baseName: 'Bitcoin',
	quoteName: 'USDT',
	baseSymbol: 'BTC',
	quoteSymbol: 'USDT',
	decimals: 8,
	decimalPlaces: 2,
});

export default PriceFeeds;
