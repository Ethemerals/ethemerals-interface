import Onboard from 'bnc-onboard';

const networkId = parseInt(process.env.REACT_APP_CHAIN_ID);
const rpcUrl = process.env.REACT_APP_RPCURL;
const apiKey = process.env.REACT_APP_DAPPID;
const infuraKey = process.env.REACT_APP_INFURA_KEY;

export function initOnboard(subscriptions) {
	const onboard = Onboard;

	return onboard({
		dappId: apiKey,
		hideBranding: false,
		networkId,
		darkMode: true,
		subscriptions,
		walletSelect: {
			wallets: [
				{ walletName: 'metamask' },
				{
					walletName: 'trezor',
					appUrl: 'https://reactdemo.blocknative.com',
					email: 'aaron@blocknative.com',
					rpcUrl,
				},
				{
					walletName: 'ledger',
					rpcUrl,
				},
				{
					walletName: 'walletConnect',
					infuraKey: infuraKey,
				},
				{ walletName: 'cobovault', appName: 'React Demo', rpcUrl },
				{
					walletName: 'lattice',
					appName: 'Onboard Demo',
					rpcUrl,
				},
				{ walletName: 'coinbase' },
				{ walletName: 'status' },
				{ walletName: 'walletLink', rpcUrl },
				{
					walletName: 'portis',
					apiKey: 'b2b7586f-2b1e-4c30-a7fb-c2d1533b153b',
				},
				{ walletName: 'fortmatic', apiKey: 'pk_test_886ADCAB855632AA' },
				{ walletName: 'torus' },
				{ walletName: 'trust', rpcUrl },
				{ walletName: 'opera' },
				{ walletName: 'operaTouch' },
				{ walletName: 'imToken', rpcUrl },
				{ walletName: 'meetone' },
				{ walletName: 'mykey', rpcUrl },
				{ walletName: 'wallet.io', rpcUrl },
				{ walletName: 'huobiwallet', rpcUrl },
				{ walletName: 'hyperpay' },
				{ walletName: 'atoken' },
				{ walletName: 'liquality' },
				{ walletName: 'frame' },
				{ walletName: 'tokenpocket', rpcUrl },
				{ walletName: 'authereum', disableNotifications: true },
				{ walletName: 'ownbit' },
			],
		},
		walletCheck: [{ checkName: 'derivationPath' }, { checkName: 'connect' }, { checkName: 'accounts' }, { checkName: 'network' }],
	});
}
