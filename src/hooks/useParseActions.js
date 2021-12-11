import { Links } from '../constants/Links';
import { Addresses } from '../constants/contracts/Addresses';
import { shortenAddress } from '../utils';

const useParseAction = (action) => {
	if (!action) {
		return ['', ''];
	}

	let actionString = 'Default Transaction';
	const txLink = `${Links.ETHERSCAN_URL}tx/${action.transaction.id}`;

	switch (action.type) {
		case 'Default':
			actionString = 'Default Transaction';
			break;
		case 'Transfer':
			actionString = 'Transfer 🎁';
			actionString = `Transfered from ${shortenAddress(action.transaction.from)} 🎁`;
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Retreated from the Eternal Battle 🛡️`;
			}
			break;
		case 'Minted':
			actionString = `Birthed by ${shortenAddress(action.transaction.from)} 🐣`;
			break;
		case 'Unstaked':
			actionString = 'Unstaked';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Retreated from Battle 🛡️`;
			}
			break;
		case 'Staked':
			actionString = 'Staked';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Entered the Eternal Battle ⚔️`;
			}
			break;
		case 'Resurrection':
			actionString = `Resurrected at the altar  💖`;
			break;
		case 'RedeemELF':
			actionString = `Drained of all Life Force  💔`;
			break;
		case 'Revived':
			actionString = 'Revived';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Revived from the Eternal Battle 💖`;
			}
			break;
		case 'Reviver':
			actionString = `Became an Angel, revived a poor soul! 😇`;
			break;
		case 'Reaped':
			actionString = 'Reaped';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Reaped from the Battle 💀`;
			}
			break;
		case 'Reaper':
			actionString = `Reaper | stole an Ethemeral! 💀`;
			break;
		default:
			console.log('did not parse action');
	}

	return [actionString, txLink];
};

export default useParseAction;
