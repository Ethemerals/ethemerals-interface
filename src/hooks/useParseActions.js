import Links from '../constants/Links';
import Addresses from '../constants/contracts/Addresses';
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
			actionString = `Was given life by ${shortenAddress(action.transaction.from)} 🐣`;
			break;
		case 'Unstaked':
			actionString = 'Unstaked';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Retreated from the Eternal Battle 🛡️`;
			}
			break;
		case 'Staked':
			actionString = 'Staked';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Entered the Eternal Battle ⚔️`;
			}
			break;
		case 'Resurrection':
			actionString = `Resurrected from the depth of sorrow  💖`;
			break;
		case 'RedeemELF':
			actionString = `Was drained of all Life Force  💔`;
			break;
		case 'Revived':
			actionString = 'Revived';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Was revived from the Eternal Battle 💖`;
			}
			break;
		case 'Reviver':
			actionString = `Became and Angel to revive a poor soul! 😇`;
			break;
		case 'Reaped':
			actionString = 'Reaped';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Was Reaped from the Eternal Battle 💀`;
			}
			break;
		case 'Reaper':
			actionString = `Became a Reaper and stole an Ethemeral! 💀`;
			break;
		default:
			console.log('did not parse action');
	}

	return [actionString, txLink];
};

export default useParseAction;
