import { getTypeFromId } from '../../../../hooks/useMeralsUtils';
import { useUser } from '../../../../hooks/useUser';

const MeralIconLarge = ({ nft, select, buttonActions }) => {
	const { address } = useUser();

	const owned = address === nft.previousOwner;
	const type = getTypeFromId(nft.meralId);

	return (
		<div onClick={() => select(nft.meralId)} className="w-44 h-72 bg-yellow-50 m-2 border border-black text-xs hover:bg-yellow-100 cursor-pointer relative">
			<p>
				type:{nft.type} / {nft.tokenId}
			</p>

			<p>HP {nft.hp}</p>
			<p>XP {nft.xp}</p>
			<p>ELF {nft.elf}</p>
			<p>atk {nft.atk}</p>
			<p>def {nft.def}</p>
			<p>spd {nft.spd}</p>
			{type === 1 && <p>{nft.name}</p>}
			{owned && (
				<div onClick={() => buttonActions(nft.meralId, 'UNSTAKE')} className="h-6 m-2 p-2 rounded-md bg-blue-300 absolute bottom-0 hover:bg-blue-200">
					LEAVE
				</div>
			)}
		</div>
	);
};

export default MeralIconLarge;
