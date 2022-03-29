import { useState, useEffect } from 'react';
import { getMeralImages, useMeralGlobal } from '../../../hooks/useMerals';
import { getSubclassInfo, useMeralsUtils } from '../../../hooks/useMeralsUtils';
import { animated, useSpring, config } from '@react-spring/web';

const MeralIcon = ({ nft, select }) => {
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
		display: 'inline-block',
		backfaceVisibility: 'hidden',
		backgroundColor: elements[nft.element].color,
		borderColor: `hsla(${subclassInfo.hue},100%,70%,1)`,
		transform: isHovered ? `translate(0px, 4px)` : `translate(0px, 92px)`,
		config: config.stiff,
	});

	const style = {
		backgroundColor: elements[nft.element].color,
		backgroundImage: `url("${elements[nft.element].img}")`,
	};

	return (
		<>
			<div
				onClick={() => select(nft.tokenId)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={style}
				className="w-24 h-28 m-2 relative text-xs cursor-pointer rounded-lg shadow-md hover:shadow-lg"
			>
				{/* MAIN IMAGE */}
				<div style={{ borderColor: `hsla(${subclassInfo.hue},100%,70%,1)` }} className="w-24 h-28 relative overflow-hidden rounded-lg border-2">
					<img style={{ width: '96px', height: '112px', objectFit: 'cover' }} src={imgSrc} alt="" />

					{/* BOTTOM BAR */}
					<animated.div style={styleHover} className="w-full bottom-0 absolute text-white border-t-2 pb-1">
						<div className="">
							<p className="text-sm font-medium whitespace-nowrap pt-3">{nft.name && nft.name.length > 0 ? nft.name : ''}</p>

							<div style={{ top: '-14px' }} className="text-xs absolute font-bold mx-auto flex items-center w-min my-2 shadow-lg rounded overflow-hidden right-0">
								<div style={{ backgroundColor: `hsla(0,100%,40%,1)`, paddingLeft: '2px', paddingRight: '2px', paddingTop: '1px', paddingBottom: '1px' }}>{nft.atk}</div>
								<div style={{ backgroundColor: `hsla(200,100%,40%,1)`, paddingLeft: '2px', paddingRight: '2px', paddingTop: '1px', paddingBottom: '1px' }}>{nft.def}</div>
								<div style={{ backgroundColor: `hsla(115,100%,40%,1)`, paddingLeft: '2px', paddingRight: '2px', paddingTop: '1px', paddingBottom: '1px' }}>{nft.spd}</div>
							</div>

							<div style={{ backgroundColor: `hsla(${subclassInfo.hue},100%,70%,1)` }} className="flex items-center">
								<img width="12" height="12" src={subclassInfo.icon} alt="subclass icon" />
								<div className="w-full bg-black pl-1 uppercase font-bold text-white overflow-hidden whitespace-nowrap">{subclassInfo.name}</div>
							</div>
						</div>
					</animated.div>
				</div>

				<p style={{ left: '-10px', top: '-10px' }} className="absolute px-1 bg-green-50 text-gray-700 rounded-md">
					#<span className="text-xs">{nft.tokenId.toString().padStart(4, '0')}</span>
				</p>
			</div>
		</>
	);
};

const MeralList = ({ nfts, select }) => {
	return <div className="flex-wrap flex">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralIcon key={nft.meralId} nft={nft} select={select} />)}</div>;
};
export default MeralList;
