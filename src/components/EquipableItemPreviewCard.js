import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useNFTUtils } from '../hooks/useNFTUtils';
import Images from '../constants/Images';

const EquipableItemPreviewCard = ({ nft }) => {
	const { getEquipableTypePalette, getEquipmentImages } = useNFTUtils();
	const history = useHistory();
	const [equipableType, setEquipableType] = useState(0);

	useEffect(() => {
		if (nft) {
			let stats = [nft.atk, nft.def, nft.spd];
			const eType = stats.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);

			setEquipableType(eType);
		}
	}, [nft]);

	if (!nft) {
		return <p>Loading</p>;
	}

	const handleOnClick = () => {
		history.push(`/equipable/${nft.id}`);
	};

	return (
		<div onClick={handleOnClick} className="w-64 h-96 bg-blue-500 m-4 cursor-pointer bg-cover relative hover:shadow-2xl hover:border-gray-100 transition duration-300">
			{/* MAIN IMAGE */}
			<div className="absolute top-0 left-0">
				<img className="" src={getEquipmentImages(nft.baseId, true).preview} alt="" />
			</div>
			{/* TOP BAR */}

			<div style={{ bottom: '70px' }} className="w-full absolute z-10 flex justify-end right-2 space-x-1">
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconAtk} alt="" />
					<span className="center text font-black">{nft.atk}</span>
				</div>
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconDef} alt="" />
					<span className="center text font-black">{nft.def}</span>
				</div>
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconSpd} alt="" />
					<span className="center text font-black">{nft.spd}</span>
				</div>
			</div>

			{/* BOTTOM BAR */}
			<div style={{ backgroundColor: getEquipableTypePalette(equipableType) }} className="w-full h-24 bottom-0 absolute overflow-hidden">
				<p className="px-2 text-xs text-white bg-black">
					#<span className="text-sm font-bold">{nft.id.padStart(4, '0')}</span>
				</p>
				<p className="px-2 text-2xl bottom-0 absolute pb-2">{nft.metadata.name}</p>
			</div>
		</div>
	);
};

export default EquipableItemPreviewCard;
