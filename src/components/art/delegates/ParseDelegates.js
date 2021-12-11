import { Addresses } from '../../../constants/contracts/Addresses';
import { shortenAddress } from '../../../utils';
import { Links } from '../../../constants/Links';

const ParseDelegates = ({ delegate }) => {
	if (!delegate.active) {
		return null;
	}

	let etherscanLink = `${Links.ETHERSCAN_URL}address/${delegate.id}`;
	return (
		<div key={delegate.id} className="px-2 py-1 text-center bg-white mb-2">
			<p>
				{shortenAddress(delegate.id)}{' '}
				<span>
					{delegate.id.toLowerCase() === Addresses.EternalBattle.toLowerCase() && '- Eternal Battle Contract'}
					{delegate.id.toLowerCase() === Addresses.changeScoreAndRewards.toLowerCase() && '- HP and ELF Rewarder'}
				</span>
			</p>
			<a href={etherscanLink} target="_blank" rel="noreferrer" className="text-xs justify-center flex items-center text-blue-600 hover:text-blue-400">
				View verified contract on etherscan
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
					<polyline points="15 3 21 3 21 9"></polyline>
					<line x1="10" y1="14" x2="21" y2="3"></line>
				</svg>
			</a>
		</div>
	);
};

export default ParseDelegates;
