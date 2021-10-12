import Onboard from 'bnc-onboard';

const networkId = parseInt(process.env.REACT_APP_CHAIN_ID);
const apiKey = process.env.REACT_APP_DAPPID;

export function initOnboard(subscriptions) {
	const onboard = Onboard;

	return onboard({
		dappId: apiKey,
		hideBranding: true,
		networkId,
		darkMode: true,
		subscriptions,
		walletSelect: {
			description: 'Please select a wallet to connect to Ethemerals:',
			wallets: [{ walletName: 'metamask' }],
		},
		walletCheck: [{ checkName: 'derivationPath' }, { checkName: 'connect' }, { checkName: 'accounts' }],
	});
}
