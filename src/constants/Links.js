const getLinks = () => {
	const network = parseInt(process.env.REACT_APP_NETWORK);

	let links = {
		BUCKET: 'https://ethemerals-media.s3.amazonaws.com/',
		LANDING_URL: 'https://www.ethemerals.com',
		DISCORD_URL: 'https://discord.gg/cwaYNS9DjG',
		ETHERSCAN_URL: 'https://etherscan.io/',
		POLYSCAN_URL: 'https://polygonscan.com/',
		SUBGRAPH_ENDPOINT_L1: 'https://api.thegraph.com/subgraphs/name/ethemerals/ethemerals-v2',
		SUBGRAPH_ENDPOINT_L2: 'https://api.thegraph.com/subgraphs/name/ethemerals/ethemerals-polygon',
		UNISWAP: 'https://google.com',
		APP: 'https://app.ethemerals.com',
		GITHUB: 'https://github.com/Ethemerals',
		INSTAGRAM: 'https://www.instagram.com/ethemeralsart/',
		TWITTER: 'https://twitter.com/ethemerals',
		DISCORD: 'https://discord.gg/cwaYNS9DjG',
		MEDIUM: 'https://medium.com/@ethemerals',
		OPENSEAS: 'https://opensea.io/assets',
		TERMS: 'https://www.ethemerals.com/terms',
		PRIVACY: 'https://www.ethemerals.com/privacy',
		OPENSEAS_COLLECTION: 'https://opensea.io/collection/ethemerals-merals',
	};

	if (network === 4) {
		links.ETHERSCAN_URL = 'https://rinkeby.etherscan.io/';
		links.POLYSCAN_URL = 'https://mumbai.polygonscan.com/';
		links.SUBGRAPH_ENDPOINT_L1 = 'https://api.thegraph.com/subgraphs/name/ethemerals/ethemerals-rinkeby';
		links.SUBGRAPH_ENDPOINT_L2 = 'https://api.thegraph.com/subgraphs/name/ethemerals/ethemerals-mumbai';
		links.OPENSEAS = 'https://testnets.opensea.io/assets';
		links.OPENSEAS_COLLECTION = 'https://testnets.opensea.io/collection/ethemerals-merals';
	}

	return { ...links };
};

const Links = getLinks();

export { Links };
