import Onboard from 'bnc-onboard';

const networkId = parseInt(process.env.REACT_APP_CHAIN_ID);
const rpcUrl = process.env.REACT_APP_RPCURL;
const apiKey = process.env.REACT_APP_DAPPID;
const infuraKey = process.env.REACT_APP_INFURA_KEY;

export function initOnboard(subscriptions) {
	const onboard = Onboard;

	return onboard({
		dappId: apiKey,
		hideBranding: true,
		networkId,
		darkMode: false,
		subscriptions,
		walletSelect: {
			wallets: [{ walletName: 'metamask' }],
		},
		walletCheck: [{ checkName: 'derivationPath' }, { checkName: 'connect' }, { checkName: 'accounts' }],
	});
}
