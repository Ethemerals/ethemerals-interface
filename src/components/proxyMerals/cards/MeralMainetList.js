import { useState, useEffect } from 'react';
import { getMeralImages, useMeralGlobal } from '../../../hooks/useMerals';
import { getSubclassInfo, useMeralsUtils } from '../../../hooks/useMeralsUtils';
import { animated, useSpring, config } from '@react-spring/web';

const MeralIcon = ({ nft, select }) => {
	const { elements } = useMeralsUtils();
	const [subclassInfo, setSubclassInfo] = useState(getSubclassInfo(0));
	const [color, setColor] = useState(undefined);
	const [isHovered, setIsHovered] = useState(false);
	const { globalColors } = useMeralGlobal(nft.tokenId);

	useEffect(() => {
		if (globalColors) {
			setColor(globalColors[nft.tokenId]);
		}
	}, [globalColors, nft]);

	useEffect(() => {
		if (nft) {
			setSubclassInfo(getSubclassInfo(nft.subclass));
		}
	}, [nft]);

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
		borderColor: `hsla(${subclassInfo.hue},100%,70%,1)`,
	};

	if (!globalColors) {
		return <></>;
	}

	return (
		<div
			onClick={() => select(nft.tokenId)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={style}
			className="w-24 h-28 m-2 border-2 relative text-xs cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg"
		>
			{/* MAIN IMAGE */}

			<img style={{ width: '96px', height: '112px', objectFit: 'cover' }} src={getMeralImages(nft.cmId, color).preview} alt="" />

			{/* BOTTOM BAR */}
			<animated.div style={styleHover} className="w-full bottom-0 absolute overflow-hidden text-white border-t-2 pb-1">
				<div className="">
					<p className="text-xs pt-1">
						#<span className="text-xs font-bold">{nft.tokenId.toString().padStart(4, '0')}</span>
					</p>

					<p className="text-sm font-medium whitespace-nowrap">{nft.name && nft.name.length > 0 ? nft.name : nft.coin}</p>

					<div className="text-xs font-bold mx-auto flex items-center w-min my-2 shadow-lg rounded overflow-hidden">
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
	);
};

const MeralMainnetList = ({ nfts, select }) => {
	return <div className="flex-wrap flex">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralIcon key={nft.meralId} nft={nft} select={select} />)}</div>;
};
export default MeralMainnetList;
