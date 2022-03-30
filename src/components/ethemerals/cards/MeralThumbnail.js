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

	const styleHover = useSpring({
		backgroundColor: elements[nft.element].color,
		transform: isHovered ? `translate(0px, 8px)` : `translate(0px, 70px)`,
		config: config.stiff,
	});

	const styleTokenId = {
		right: '-8px',
		top: '-8px',
		color: `hsla(${subclassInfo.hue},100%,40%,1)`,
	};

	return (
		<>
			<div onClick={() => select(nft.meralId)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="w-26 h-28 text-xs relative m-2">
				{/* MAIN IMAGE */}
				<div
					style={{ borderColor: `hsla(${subclassInfo.hue},100%,70%,1)`, backgroundColor: `hsla(${subclassInfo.hue},100%,70%,1)` }}
					className="w-26 h-28 relative overflow-hidden rounded-lg bg-contain border-2 shadow-md hover:shadow-lg cursor-pointer"
				>
					<img
						className="rounded-lg"
						style={{ width: '104px', height: '104px', objectFit: 'cover', backgroundImage: `url("${elements[nft.element].img}")`, backgroundSize: 'cover' }}
						src={imgSrc}
						alt=""
					/>

					{/* BOTTOM BAR */}
					<animated.div style={styleHover} className="w-full bottom-0 absolute text-white pb-2">
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

				<div style={styleTokenId} className="absolute px-1 bg-white rounded-md shadow">
					#<span className="text-xs">{nft.tokenId.toString().padStart(4, '0')}</span>
				</div>
			</div>
		</>
	);
};

export default MeralThumbnail;
