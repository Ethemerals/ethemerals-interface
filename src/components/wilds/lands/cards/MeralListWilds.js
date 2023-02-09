import { useEffect, useState } from 'react';
import { getTypeFromId } from '../../../../hooks/useMeralsUtils';
import { calculateDamage, useWildsLand } from '../../../../hooks/useWilds';

const MeralIcon = ({ nft, select, landId }) => {
	let type = getTypeFromId(nft.meralId);

	const [currentDamage, setCurrentDamage] = useState(0);
	const { wildsLand, stakes, stakeEvents } = useWildsLand(parseInt(landId));

	useEffect(() => {
		if (stakes && stakeEvents && wildsLand) {
			try {
				let stake = stakes[nft.meralId];
				let damage = calculateDamage(nft, stake, stakeEvents, wildsLand.baseDefence);
				setCurrentDamage(damage);
			} catch (error) {
				console.log(error);
			}
		}

		return () => {
			setCurrentDamage(0);
		};
	}, [stakes, stakeEvents, wildsLand, nft]);

	return (
		<div onClick={() => select(nft.meralId)} className="w-16 h-16 bg-yellow-50 m-2 border border-black text-xs hover:bg-yellow-400 cursor-pointer">
			<p>
				type:{nft.type} / {nft.tokenId}
			</p>

			{currentDamage > 0 ? (
				<p>
					<span>hp:{nft.hp - currentDamage}</span>
					<span className="text-red-500">{`(-${currentDamage})`}</span>
				</p>
			) : (
				<p>{nft.hp}</p>
			)}

			{type === 1 && <p>{nft.name}</p>}
		</div>
	);
};

const MeralListWilds = ({ nfts, select, landId }) => {
	return <div className="flex-wrap flex">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralIcon key={nft.meralId} nft={nft} select={select} landId={landId} />)}</div>;
};
export default MeralListWilds;
