import { Links } from '../constants/Links';
import { shortenAddress } from '../utils';

// Default
// Minted
// Transfer
// SendELF
// ReceiveELF
// Send
// Receive
// Staked
// Unstaked
// Revived
// Reviver
// Reaped
// Reaper
// RedeemELF
// RedeemHonor
// Resurrection
// DelegateChange

const useParseAccountAction = (action) => {
	if (!action) {
		return ['', ''];
	}

	let words = [];
	let actionString = '';
	const txLink = `${Links.ETHERSCAN_URL}tx/${action.transaction.id}`;

	if (action.description) {
		actionString = action.description;

		const globalRegex = new RegExp(/^0x[a-fA-F0-9]{40}$/);
		actionString.split(' ').forEach((word) => {
			if (globalRegex.test(word)) {
				words.push(shortenAddress(word));
			} else {
				words.push(word);
			}
		});
	}

	switch (action.type) {
		case 'Default':
			words = ['Default', 'Transaction'];
			break;
		case 'SendELF':
			words.push('🎁');
			break;
		case 'ReceiveELF':
			// TODO PARSE FROM CONTRACT OR FARM
			words.push('🎁');
			break;
		case 'Send': // ACCOUNT SEND TOKEN
			words.push('🎁');
			break;
		case 'Receive': // ACCOUNT RECEIVED TOKEN // New Minted if from == self
			words.push('💖');
			break;
		case 'Unstaked':
			words.push('🛡️');
			break;
		case 'Staked':
			words.push('⚔️');
			break;
		case 'Resurrection':
			words.push('💖');
			break;
		case 'RedeemELF':
			words.push('💖');
			break;
		case 'RedeemHonor':
			words.push('🎖️');
			break;
		case 'Revived':
			words.push('💖');
			break;
		case 'Reviver':
			words.push('😇');
			break;
		case 'Reaper':
			words.push('💀');
			break;
		case 'DelegateChange': // ACCOUNT
			words.push('👍');
			break;
		default:
			console.log('did not parse action');
	}

	return [words.join(' '), txLink];
};

export default useParseAccountAction;
