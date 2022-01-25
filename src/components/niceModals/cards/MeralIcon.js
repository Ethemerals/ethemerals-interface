import { getTypeFromId } from '../../../hooks/useMeralUtils';

const MeralIcon = ({ nft, select }) => {
	let type = getTypeFromId(nft.meralId);
	return (
		<div onClick={() => select(nft.meralId)} className="w-24 h-24 bg-yellow-50 m-2 border border-black text-xs hover:bg-yellow-400 cursor-pointer">
			<p>
				type:{nft.type} / {nft.tokenId}
			</p>

			<p>HP {nft.hp}</p>
			<p>XP {nft.xp}</p>
			<p>ELF {nft.elf}</p>
			{type === 1 && <p>{nft.name}</p>}
		</div>
	);
};
export default MeralIcon;
