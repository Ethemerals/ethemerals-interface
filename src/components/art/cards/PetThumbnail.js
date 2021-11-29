import { useNFTUtils } from '../../../hooks/useNFTUtils';

const getType = (nft) => {
	let stats = [nft.atk, nft.def, nft.spd];
	return stats.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
};

const PetThumbnail = ({ nft, item = false, handleRemove }) => {
	const { getEquipmentImages, getEquipableTypePalette } = useNFTUtils();
	const bgImg = getEquipmentImages(nft.baseId, item).thumbnail;

	if (!bgImg) {
		return (
			<div style={{ width: '74px', height: '74px' }} className="relative">
				loading
			</div>
		);
	}

	return (
		<div onClick={handleRemove} style={{ width: '74px', height: '74px', backgroundColor: getEquipableTypePalette(getType(nft)) }} className="relative shadow-md cursor-pointer hover:shadow-lg">
			<img width="74" height="74" src={bgImg} alt="" />
			<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.id.padStart(4, '0')}</span>
			<div style={{ width: '74px', height: '74px', backgroundColor: 'red' }} className="absolute top-0 left-0 opacity-zero hover:opacity-50"></div>
		</div>
	);
};

export default PetThumbnail;
