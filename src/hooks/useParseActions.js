import { Links } from '../constants/Links';
import { shortenAddress } from '../utils';

const useParseAction = (action, isLayer2 = false) => {
	if (!action) {
		return ['', ''];
	}

	let words = [];
	let actionString = '';
	let txLink = `${Links.ETHERSCAN_URL}tx/${action.transaction.id}`;
	if (isLayer2) {
		txLink = `${Links.POLYSCAN_URL}tx/${action.transaction.id}`;
	}

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
		case 'Transfer':
			words.push('🎁');
			break;
		case 'Minted':
			if (isLayer2) {
				words.shift();
				words.unshift('Virtualized');
			}
			words.push('🐣');
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
			words.push('💔');
			break;
		case 'Revived':
			words.push('💖');
			break;
		case 'Reviver':
			words.push('😇');
			break;
		case 'Reaped':
			words.push('💀');
			break;
		case 'Reaper':
			words.push('💀');
			break;
		default:
			console.log('did not parse action');
	}

	return [words.join(' '), txLink];
};

export default useParseAction;
