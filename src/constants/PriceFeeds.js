const PriceFeeds = [];

const pools = {
	usdc_eth: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
	wbtc_eth: '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed',
	uni_eth: '0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801',
	wbtc_usdc: '0x99ac8ca7087fa4a2a1fb6357269965a2014abc35',
};

const tokens = {
	weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
	wbtc: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
	usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
	uni: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
	link: '0x514910771af9ca656af840dff83e8264ecf986ca',
};

PriceFeeds.push({
	name: 'BTC/USD',
	pool: pools.wbtc_usdc,
	period: 1,
	baseAmount: '10000000', // js
	base: tokens.wbtc,
	quote: tokens.usdc,
	price: '1',
	id: 0,
	baseName: 'Bitcoin',
	quoteName: 'USDC',
	baseSymbol: 'BTC',
	quoteSymbol: 'USD',
});

PriceFeeds.push({
	name: 'ETH/USD',
	pool: pools.usdc_eth,
	period: 1,
	baseAmount: '1000000000000000000', // js
	base: tokens.weth,
	quote: tokens.usdc,
	price: '1',
	id: 1,
	baseName: 'Ethereum',
	quoteName: 'USDC',
	baseSymbol: 'ETH',
	quoteSymbol: 'USD',
});

PriceFeeds.push({
	name: 'ETH/BTC',
	pool: pools.wbtc_eth,
	period: 1,
	baseAmount: '1000000000000000000000', // js
	base: tokens.weth,
	quote: tokens.wbtc,
	price: '1',
	id: 2,
	baseName: 'Ethereum',
	quoteName: 'Bitcoin',
	baseSymbol: 'ETH',
	quoteSymbol: 'BTC',
});

PriceFeeds.push({
	name: 'UNI/ETH',
	pool: pools.uni_eth,
	period: 1,
	baseAmount: '1000000000000', // js
	base: tokens.uni,
	quote: tokens.weth,
	price: '1',
	id: 3,
	baseName: 'Uniswap',
	quoteName: 'Ethereum',
	baseSymbol: 'UNI',
	quoteSymbol: 'ETH',
});

export default PriceFeeds;
