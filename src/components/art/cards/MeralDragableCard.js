import { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../utils/items';
import { useNFTUtils, getSubclassInfo } from '../../../hooks/useNFTUtils';
import { getMeralImages } from '../../../hooks/useMerals';

const idsToElements = (id) => {
	let element = 'Void';
	let color = 'hsl(0, 0%, 17%)';
	let voidElement = ['0', '1', '2', '3', '4'];
	let earth = ['5', '6', '7', '8', '9'];
	let fire = ['10', '11', '12', '13'];
	let water = ['14', '15', '16', '17', '18'];
	let wind = ['19', '20', '21', '22', '23', '24'];

	if (voidElement.indexOf(id) >= 0) {
		element = 'VOID';
		color = 'hsl(0, 0%, 10%)';
	}
	if (earth.indexOf(id) >= 0) {
		element = 'EARTH';
		color = 'hsl(0, 0%, 17%)';
	}
	if (fire.indexOf(id) >= 0) {
		element = 'FIRE';
		color = 'hsl(0, 80%, 50%)';
	}
	if (water.indexOf(id) >= 0) {
		element = 'WATER';
		color = 'hsl(230, 80%, 60%)';
	}
	if (wind.indexOf(id) >= 0) {
		element = 'WIND';
		color = 'hsl(289, 80%, 70%)';
	}

	return { element, color };
};

const MeralDragableCard = ({ nft, owned, dropped }) => {
	const { elements } = useNFTUtils();
	const [subclassInfo, setSubclassInfo] = useState(undefined);

	const [{ isDragging }, drag] = useDrag(() => ({
		type: ItemTypes.CARD,
		item: {
			type: ItemTypes.MERALS,
			id: nft.tokenId,
			nft: nft,
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	useEffect(() => {
		if (nft) {
			setSubclassInfo(getSubclassInfo(nft.subclass));
		}
	}, [nft]);

	if (!nft || !subclassInfo) {
		return (
			<div
				style={{
					backgroundColor: elements[4].color,
					minWidth: '160px',
					maxWidth: '160px',
					maxHeight: '212px',
					minHeight: '212px',
				}}
				className="m-2 my-4 cursor-pointer bg-cover relative hover:shadow-2xl hover:border-gray-100 transition duration-300 mx-auto"
			>
				<div className="text-xs font-bold absolute right-0 text-right text-white z-10"></div>

				{/* MAIN IMAGE */}
				<div className="absolute top-0 left-0"></div>

				{/* TOP BAR */}
				<div className="absolute flex items-center p-1 "></div>

				<div style={{ bottom: '64px' }} className="w-full absolute z-10 flex justify-end right-2 space-x-2">
					<div className="relative"></div>
					<div className="relative"></div>
					<div className="relative"></div>
				</div>

				{/* BOTTOM BAR */}

				<div className="w-full bottom-0 absolute overflow-hidden">
					<div className="px-2 py-1">
						<p className="text-xs text-white"></p>
						<p className="text-2xl font-medium"></p>
						<div className="flex h-6 my-1 items-center">
							<div className="w-full bg-black pl-2 uppercase font-bold text-white"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			ref={drag}
			style={{
				opacity: isDragging ? '0.4' : dropped ? '0.3' : '1',
				backgroundColor: elements[nft.element].color,
				backgroundImage: `url("${elements[nft.element].img}")`,
				minWidth: '160px',
				maxWidth: '160px',
				maxHeight: '212px',
				minHeight: '212px',
			}}
			className={`m-2 my-4 bg-cover relative ${dropped ? '' : 'cursor-pointer hover:shadow-2xl hover:border-gray-100 transition duration-300'} mx-auto`}
		>
			{/* MAIN IMAGE */}
			<div style={{ minWidth: '160px', maxWidth: '160px', maxHeight: '212px', minHeight: '212px' }} className="overflow-hidden">
				<img width="160" height="212" className="" src={getMeralImages(nft.cmId, 0).preview} alt="" />
			</div>
			{idsToElements(nft.element).element !== 'VOID' && (
				<div style={{ backgroundColor: idsToElements(nft.element).color }} className="right-0 pr-1 pl-2 rounded-l-md mt-1 top-0 absolute overflow-hidden text-white text-xs font-bold">
					{idsToElements(nft.element).element}
				</div>
			)}

			{owned && (
				<div style={{ backgroundColor: 'hsl(36, 100%, 50%)' }} className="left-0 pl-1 pr-1 rounded-r-md mt-1 top-0 absolute overflow-hidden text-white text-xs font-bold">
					OWNED
				</div>
			)}

			{/* BOTTOM BAR */}
			<div style={{ backgroundColor: elements[nft.element].color1 }} className="w-full bottom-0 absolute overflow-hidden text-white">
				<div className="px-1">
					<div>
						#<span className="font-bold">{nft.tokenId.toString().padStart(4, '0')}</span>
					</div>

					<div style={{ backgroundColor: `hsla(${subclassInfo.hue},100%,70%,1)` }} className="flex h-6 my-1 items-center overflow-hidden whitespace-pre">
						<img style={{ margin: '1px 2px 1px 2px' }} width="20" height="20" src={subclassInfo.icon} alt="subclass icon" />
						<div className="w-full bg-black pl-2 uppercase font-bold text-white">{nft.coin}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MeralDragableCard;
