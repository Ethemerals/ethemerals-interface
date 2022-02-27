import { getTypeFromId } from '../../../hooks/useMeralUtils';

const MeralIcon = ({ nft, select }) => {
	let type = getTypeFromId(nft.meralId);
	return (
		<div onClick={() => select(nft.meralId)} className="w-20 h-20 bg-white m-2 border border-black text-xs hover:bg-green-100 cursor-pointer">
			<p>#{nft.meralId}</p>

			<p>HP {nft.hp}</p>
			<p>XP {nft.xp}</p>
			<p>ELF {nft.elf}</p>
			{type === 1 && <p>{nft.name}</p>}
		</div>
	);
};
export default MeralIcon;
