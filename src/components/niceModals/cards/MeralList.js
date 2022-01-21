import MeralIcon from './MeralIcon';

const MeralList = ({ nfts, select }) => {
	return <div className="flex-wrap flex justify-center">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralIcon key={nft.meralId} nft={nft} select={select} />)}</div>;
};
export default MeralList;
