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
			actionString = 'Transfer';
			console.log(action);
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Retrieved Ethemeral  from Eternal Battle 🛡️`;
			}
			break;
		case 'Minted':
			actionString = 'Minted';
			break;
		case 'Unstaked':
			actionString = 'Unstaked';
			if (action.transaction.from === Addresses.EternalBattle) {
				actionString = `Retrieved Ethemeral  from Eternal Battle 🛡️`;
			}
			break;
		case 'Staked':
			actionString = 'Staked';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Entered an Eternal Battle ⚔️`;
			}
			break;
		case 'Resurrection':
			actionString = `Resurrected Ethemeral  💖`;
			break;
		case 'RedeemELF':
			actionString = `Drained ELF from Ethemeral  💔`;
			break;
		case 'Revived':
			actionString = 'Revived';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Ethemeral was revived from Eternal Battle 💖`;
			}
			break;
		case 'Reviver':
			actionString = `Sent Angel Ethemeral to revive a poor soul! 😇`;
			break;
		case 'Reaped':
			actionString = `Reaped`;
			break;
		case 'Reaper':
			actionString = `Sent Reaper Ethemeral  in for the kill! 💀`;
			break;
		default:
			console.log('did not parse action');
	}

	return [actionString, txLink];
};

export default useParseAction;
