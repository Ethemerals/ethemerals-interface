import Links from '../constants/Links';
import Addresses from '../constants/contracts/Addresses';
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

	let actionString = 'Default Transaction';
	const txLink = `${Links.ETHERSCAN_URL}tx/${action.transaction.id}`;

	switch (action.type) {
		case 'Default':
			actionString = 'Default Transaction';
			break;
		case 'SendELF':
			actionString = `Sent ELF to ${shortenAddress(action.transaction.to)} 🔥`;
			break;
		case 'ReceiveELF':
			// TODO PARSE FROM CONTRACT OR FARM
			actionString = `Received ELF from ${shortenAddress(action.transaction.from)} 🔥`;
			break;
		case 'Send': // ACCOUNT SEND TOKEN
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Sent Ethemeral #${action.ethemeral.id} to Eternal Battle ⚔️`;
			} else {
				actionString = `Sent Ethemeral #${action.ethemeral.id} to ${shortenAddress(action.transaction.to)} 🎁`;
			}
			break;
		case 'Receive': // ACCOUNT RECEIVED TOKEN // New Minted if from == self
			if (action.ethemeral.id !== null) {
				if (action.transaction.from === action.account.id) {
					actionString = `Minted Ethemeral #${action.ethemeral.id}. Congratulations! ❤️‍🔥`;
				} else {
					actionString = `Received Ethemeral #${action.ethemeral.id} from ${shortenAddress(action.transaction.from)} 🎁`;
				}
			}
			break;
		case 'Unstaked':
			actionString = 'Unstaked';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Retrieved Ethemeral #${action.ethemeral.id} from Eternal Battle 🛡️`;
			}
			break;
		case 'Staked':
			actionString = 'Staked';
			break;
		case 'Resurrection':
			actionString = `Resurrected Ethemeral #${action.ethemeral.id} 💖`;
			break;
		case 'RedeemELF':
			actionString = `Drained ELF from Ethemeral #${action.ethemeral.id} 💔`;
			break;
		case 'RedeemHonor':
			actionString = `Redeemed Highest Honor Fund 🎖️`;
			break;
		case 'Revived':
			actionString = 'Revived';
			if (action.transaction.to === Addresses.EternalBattle) {
				actionString = `Ethemeral #${action.ethemeral.id} was revived from Eternal Battle 💖`;
			}
			break;
		case 'Reviver':
			actionString = `Sent Angel Ethemeral #${action.ethemeral.id} to revive a poor soul! 😇`;
			break;
		case 'Reaper':
			actionString = `Sent Reaper Ethemeral #${action.ethemeral.id} in for the kill! 💀`;
			break;
		case 'DelegateChange': // ACCOUNT
			actionString = `Allow / Disallow Delegates Change 👍`;
			break;
		default:
			console.log('did not parse action');
	}

	return [actionString, txLink];
};

export default useParseAccountAction;
