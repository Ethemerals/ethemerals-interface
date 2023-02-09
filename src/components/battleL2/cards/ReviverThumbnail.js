import { useState, useEffect } from 'react';
import { getMeralImages, useMeralGlobal } from '../../../hooks/useMerals';
import { getSubclassInfo, useMeralsUtils } from '../../../hooks/useMeralsUtils';

const ReviverThumbnail = ({ nft, select }) => {
	const { elements } = useMeralsUtils();
	const [subclassInfo, setSubclassInfo] = useState(getSubclassInfo(0));
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

	const styleTokenId = {
		right: '-24px',
		bottom: '-1px',
		color: `hsla(${subclassInfo.hue},100%,40%,1)`,
	};

	return (
		<div onClick={() => select(nft.meralId)} style={{ width: '48px', height: '48px', bottom: '17px' }} className="text-xs absolute right-3 cursor-pointer">
			<img
				className="rounded-lg"
				style={{
					border: `2px solid hsla(${subclassInfo.hue},100%,70%,1)`,
					width: '48px',
					height: '48px',
					objectFit: 'cover',
					backgroundImage: `url("${elements[nft.element].img}")`,
					backgroundSize: 'cover',
				}}
				src={imgSrc}
				alt=""
			/>

			<div style={styleTokenId} className="absolute px-1 bg-white rounded-md shadow text-xs">
				#{nft.tokenId.toString().padStart(4, '0')}
			</div>
		</div>
	);
};

export default ReviverThumbnail;
