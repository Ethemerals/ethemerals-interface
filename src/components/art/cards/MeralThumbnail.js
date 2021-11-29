import { useNFTUtils } from '../../../hooks/useNFTUtils';
import { useMeralImagePaths } from '../../../hooks/useMeralImagePaths';

const MeralThumbnail = ({ nft, handleRemove }) => {
	const { meralImagePaths } = useMeralImagePaths(nft.id);
	const { elements } = useNFTUtils();

	if (!meralImagePaths) {
		return (
			<div style={{ width: '74px', height: '74px' }} className="relative">
				loading
			</div>
		);
	}

	return (
		<div onClick={handleRemove} style={{ width: '74px', height: '74px', backgroundColor: elements[nft.bgId].color }} className="relative shadow-md cursor-pointer hover:shadow-lg">
			<img width="74" height="74" src={meralImagePaths.thumbnail} alt="" />
			<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.id.padStart(4, '0')}</span>
			<div style={{ width: '74px', height: '74px', backgroundColor: 'red' }} className="absolute top-0 left-0 opacity-zero hover:opacity-50"></div>
		</div>
	);
};

export default MeralThumbnail;
