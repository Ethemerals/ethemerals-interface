import { useState, useEffect, useContext } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../utils/items';
import { useNFTUtils } from '../../../hooks/useNFTUtils';

const PetDragableCard = ({ nft, owned, dropped }) => {
	const { getEquipmentImages } = useNFTUtils();
	const [equipableType, setEquipableType] = useState(0);

	const [{ isDragging }, drag] = useDrag(() => ({
		type: ItemTypes.CARD,
		item: {
			type: ItemTypes.PETS,
			id: nft.id,
			nft: nft,
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

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

	// const handleOnClick = () => {
	// 	history.push(`/equipable/${nft.id}`);

	// };

	const getBorderColor = (rank) => {
		if (rank === 6) {
			return 'hsla(290, 100%, 50%, 1)';
		}
		if (rank === 5) {
			return 'hsla(280, 40%, 60%, 1)';
		}
		if (rank === 4) {
			return 'hsla(24, 40%, 60%, 1)';
		}
		if (rank === 3) {
			return 'hsla(223, 40%, 60%, 1)';
		}
		if (rank === 2) {
			return 'hsla(129, 40%, 60%, 1)';
		}

		return 'hsla(225, 10%, 60%, 1)';
	};

	function getTypePallet(type) {
		let palette;
		if (type === 0) {
			palette = 'hsla(360,80%,40%,1)';
		}
		if (type === 1) {
			palette = 'hsla(220,80%,40%,1)';
		}
		if (type === 2) {
			palette = 'hsla(160,80%,40%,1)';
		}
		return palette;
	}

	return (
		<div
			ref={drag}
			style={{
				opacity: isDragging || dropped ? '0.3' : '1',
				borderColor: getBorderColor(parseInt(nft.rarity)),
				backgroundColor: 'hsl(186, 33%, 94%)',
				minWidth: '160px',
				maxWidth: '160px',
				maxHeight: '212px',
				minHeight: '212px',
			}}
			className={`m-2 my-4 bg-cover border-2 rounded-2xl relative mx-auto ${dropped ? '' : 'cursor-pointer hover:shadow-2xl hover:border-gray-100 transition duration-300'}`}
		>
			{/* MAIN IMAGE */}
			<div style={{ minWidth: '160px', maxWidth: '160px', maxHeight: '212px', minHeight: '212px' }} className="absolute top-6 left-0">
				<img width="160" height="212" className="" src={getEquipmentImages(nft.baseId).preview} alt="" />
			</div>
			{/* TOP BAR */}
			<div className="w-full flex items-center justify-center">
				<span style={{ backgroundColor: getTypePallet(equipableType) }} className="px-1 mx-1 text-sm font-bold rounded text-white">
					#{nft.id.padStart(4, '0')}
				</span>
				{owned && (
					<div style={{ backgroundColor: 'hsl(36, 100%, 50%)' }} className="rounded mt-1 px-2 top-4 absolute overflow-hidden text-white text-xs font-bold">
						OWNED
					</div>
				)}
			</div>

			{/* BOTTOM BAR */}
			{/* style={{ backgroundColor: getEquipableTypePalette(equipableType) }} */}
			<div className="w-full bottom-0 absolute overflow-hidden">
				<p className="text-center font-bold text-2xl text-black">{nft.metadata.name}</p>
			</div>
		</div>
	);
};

export default PetDragableCard;
