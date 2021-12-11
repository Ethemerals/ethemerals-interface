const getLinks = () => {
	const network = process.env.REACT_APP_NETWORK;

	let links = {
		LANDING_URL: 'https://www.ethemerals.com',
		DISCORD_URL: 'https://discord.gg/5GUbsxed6G',
		ETHERSCAN_URL: 'https://etherscan.io/',
		SUBGRAPH_ENDPOINT: 'https://api.thegraph.com/subgraphs/name/ethemerals/ethemerals',
		UNISWAP: 'https://google.com',
		APP: 'https://app.ethemerals.com',
		GITHUB: 'https://github.com/Ethemerals',
		INSTAGRAM: 'https://www.instagram.com/ethemeralsart/',
		TWITTER: 'https://twitter.com/ethemerals',
		DISCORD: 'https://discord.gg/6uVBgFDtek',
		MEDIUM: 'https://medium.com/@ethemerals',
		OPENSEAS: 'https://opensea.io/assets',
		TERMS: 'https://www.ethemerals.com/terms',
		PRIVACY: 'https://www.ethemerals.com/privacy',
		OPENSEAS_COLLECTION: 'https://opensea.io/collection/ethemerals-merals',
	};

	if (network === '4') {
		links.ETHERSCAN_URL = 'https://rinkeby.etherscan.io/';
		links.SUBGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/ethemerals/ethemerals-rinkeby';
		links.OPENSEAS = 'https://testnets.opensea.io/assets';
		links.OPENSEAS_COLLECTION = 'https://testnets.opensea.io/collection/ethemerals-merals';
	}

	return links;
};

const Links = getLinks();

export { Links };
