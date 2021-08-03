import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCore } from '../../hooks/useCore';
import useUserAccount from '../../hooks/useUserAccount';

import { formatELF } from '../../utils';

const HighestHonorBar = () => {
	const history = useHistory();
	const { core } = useCore();
	const { account } = useUserAccount();
	const [winningCoin, setWinningCoin] = useState(false);
	const [isOwnedWinning, setIsOwnedWinning] = useState(false);

	useEffect(() => {
		if (account && core) {
			if (account.ethemerals.length > 0) {
				setIsOwnedWinning(false);
				account.ethemerals.forEach((userNFT) => {
					if (userNFT.id === core.winningCoin) {
						setIsOwnedWinning(true);
						setWinningCoin(userNFT);
					}
				});
			}
		}
	}, [account, core, winningCoin]);

	return (
		<>
			{core && (
				<div className="w-full flex bg-gray-500 max-w-4xl mx-auto px-4 py-2 my-2 space-x-3 items-center">
					<p>{`Highest Honor Funds: ${formatELF(core.winnerFunds)} ELF`}</p>
					<p>{`Rewards Multiplier: ${core.winnerMult}x`}</p>

					<p>{`Winning Ethemeral: #${core.winningCoin.padStart(4, '0')}`}</p>

					<button
						onClick={() => history.push(`/claim/${core.winningCoin}`)}
						className={`${isOwnedWinning ? 'bg-pink-700 cursor-pointer' : 'bg-gray-400 cursor-default'} px-4 py-2 rounded-lg text-xs mx-2 font-bold`}
					>
						CLAIM
					</button>
				</div>
			)}
		</>
	);
};

export default HighestHonorBar;
