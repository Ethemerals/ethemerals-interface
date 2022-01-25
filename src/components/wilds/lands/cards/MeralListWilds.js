import { getTypeFromId } from '../../../../hooks/useMeralUtils';

const MeralIcon = ({ nft, select }) => {
	let type = getTypeFromId(nft.meralId);
	return (
		<div onClick={() => select(nft.meralId)} className="w-16 h-16 bg-yellow-50 m-2 border border-black text-xs hover:bg-yellow-400 cursor-pointer">
			<p>
				type:{nft.type} / {nft.tokenId}
			</p>

			<p>HP {nft.hp}</p>

			{type === 1 && <p>{nft.name}</p>}
		</div>
	);
};

const MeralListWilds = ({ nfts, select }) => {
	return <div className="flex-wrap flex">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralIcon key={nft.meralId} nft={nft} select={select} />)}</div>;
};
export default MeralListWilds;
