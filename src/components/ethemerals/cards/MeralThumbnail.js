import NiceModal from '@ebay/nice-modal-react';
import { modalRegistry } from '../../niceModals/RegisterModals';
import { useState, useEffect } from 'react';
import { getMeralImages, useMeralGlobal } from '../../../hooks/useMerals';
import { getSubclassInfo, useMeralsUtils } from '../../../hooks/useMeralsUtils';
import { animated, useSpring, config } from '@react-spring/web';

const MeralThumbnail = ({ nft, select }) => {
	const { elements } = useMeralsUtils();
	const [subclassInfo, setSubclassInfo] = useState(getSubclassInfo(0));
	const [isHovered, setIsHovered] = useState(false);
	const [imgSrc, setImgSrc] = useState(undefined);

	// TYPE 1
	const { globalColors } = useMeralGlobal(nft.tokenId, nft.type);
	const [color, setColor] = useState(undefined);

	useEffect(() => {
		if (nft) {
			setSubclassInfo(getSubclassInfo(nft.subclass));
		}
	}, [nft]);

	useEffect(() => {
		// TYPE 1
		if (nft && parseInt(nft.type) === 1) {
			if (globalColors) {
				setColor(globalColors[nft.tokenId]);
			}
			setImgSrc(getMeralImages(nft.cmId, color).preview);
		}
		// TODO
	}, [nft, color, globalColors]);

	const expand = () => {
		NiceModal.show(modalRegistry.meralDetails, { id: nft.meralId });
	};

	const styleHover = useSpring({
		backgroundColor: elements[nft.element].color,
		transform: isHovered ? `translate(0px, 8px)` : `translate(0px, 110px)`,
		config: config.stiff,
	});

	const styleTokenId = useSpring({
		right: '-10px',
		top: '-6px',
		color: `hsla(${subclassInfo.hue},100%,40%,1)`,
		transform: isHovered ? `scale(0)` : `scale(1)`,
		config: config.stiff,
	});

	const styleZoom = useSpring({
		right: '0px',
		top: '0px',
		backgroundColor: `hsla(${subclassInfo.hue},100%,70%,1)`,
		padding: '2px',
		transform: !isHovered ? `scale(0)` : `scale(1)`,
		config: config.stiff,
	});

	return (
		<div className="w-26 h-28 text-xs relative">
			<div onClick={() => select(nft.meralId)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
				{/* BACK DROP */}
				<div style={{ backgroundColor: `hsla(${subclassInfo.hue},100%,70%,1)` }} className="w-26 h-28 shadow-md hover:shadow-lg cursor-pointer rounded-lg">
					<div style={{ width: '100px', height: '104px', left: '2px', top: '2px' }} className="overflow-hidden absolute rounded-lg">
						{/* IMAGE */}
						<img
							className="rounded-lg"
							style={{ width: '104px', height: '104px', objectFit: 'cover', backgroundImage: `url("${elements[nft.element].img}")`, backgroundSize: 'cover' }}
							src={imgSrc}
							alt=""
						/>
						{/* BOTTOM BAR */}
						<animated.div style={styleHover} className="w-full bottom-0 absolute text-white pb-2">
							{/* <p className="text-xs text-right font-bold whitespace-nowrap pt-3 pr-1">HP: {nft.hp}</p> */}
							{/* <p className="text-xs text-right font-bold whitespace-nowrap pr-1">ELF: {nft.elf}</p> */}

							<p className="text-sm font-medium whitespace-nowrap pt-3">{nft.name && nft.name.length > 0 ? nft.name : ''}</p>

							<div style={{ top: '-18px' }} className="text-xs absolute font-bold mx-auto flex items-center w-min my-2 shadow-lg rounded overflow-hidden right-0">
								<div style={{ backgroundColor: `hsla(0,100%,40%,1)`, paddingLeft: '2px', paddingRight: '2px', paddingTop: '1px', paddingBottom: '1px' }}>{nft.atk}</div>
								<div style={{ backgroundColor: `hsla(200,100%,40%,1)`, paddingLeft: '2px', paddingRight: '2px', paddingTop: '1px', paddingBottom: '1px' }}>{nft.def}</div>
								<div style={{ backgroundColor: `hsla(115,100%,40%,1)`, paddingLeft: '2px', paddingRight: '2px', paddingTop: '1px', paddingBottom: '1px' }}>{nft.spd}</div>
							</div>

							<div style={{ backgroundColor: `hsla(${subclassInfo.hue},100%,70%,1)` }} className="flex items-center">
								<img width="12" height="12" src={subclassInfo.icon} alt="subclass icon" />
								<div className="w-full bg-black pl-1 uppercase font-bold text-white overflow-hidden whitespace-nowrap">{subclassInfo.name}</div>
							</div>
						</animated.div>
					</div>
				</div>
			</div>

			<animated.div style={styleTokenId} className="absolute px-1 bg-white rounded-md shadow text-xs">
				#{nft.tokenId.toString().padStart(4, '0')}
			</animated.div>
			<animated.div
				onClick={expand}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={styleZoom}
				className="absolute bg-white rounded-md shadow cursor-pointer text-black bg-opacity-60 hover:text-white"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
					<path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
					<path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
				</svg>
			</animated.div>
		</div>
	);
};

export default MeralThumbnail;
