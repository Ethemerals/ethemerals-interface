import { getTypeFromId } from '../../../hooks/useMeralUtils';

const MeralIcon = ({ nft, select }) => {
	let type = getTypeFromId(nft.meralId);
	return (
		<div className="w-16 h-16 bg-yellow-50 m-2 border border-black text-xs">
			<p>type:{nft.type}</p>
			<p>{nft.tokenId}</p>
			{type === 1 && <p>{nft.coin}</p>}
		</div>
	);
};

const MeralListStatic = ({ nfts }) => {
	return <div className="flex-wrap flex justify-center">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralIcon key={nft.meralId} nft={nft} />)}</div>;
};
export default MeralListStatic;
