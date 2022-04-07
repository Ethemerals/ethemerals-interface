import { useEternalBattleChampions } from '../../../hooks/useEternalBattleL2';

import { useState, useEffect } from 'react';
import { getMeralImages, useMeralGlobal } from '../../../hooks/useMerals';
import { getSubclassInfo, useMeralsUtils } from '../../../hooks/useMeralsUtils';

import championFrame from '../../../assets/battle/champion_frame.png';

const MeralThumbnail = ({ nft }) => {
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

	return (
		<div style={{ width: '132px', height: '132px' }} className="text-xs relative mx-auto">
			<div style={{ backgroundColor: `hsla(${subclassInfo.hue},100%,70%,1)` }} className="shadow-md rounded-2xl border-4 border-white">
				{/* IMAGE */}
				<img
					className="rounded-2xl"
					style={{ width: '132px', height: '132px', objectFit: 'cover', backgroundImage: `url("${elements[nft.element].img}")`, backgroundSize: 'cover' }}
					src={imgSrc}
					alt=""
				/>
			</div>
		</div>
	);
};

const Champions = ({ priceFeed }) => {
	const { meral } = useEternalBattleChampions(404);

	const style = {
		boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4)',
		backgroundColor: 'hsl(215, 60%, 30%)',
	};

	const styleTokenId = {
		top: '184px',
		color: `hsla(225,20%,20%,1)`,
	};

	return (
		<div style={style} className="w-1/3 rounded-md relative overflow-hidden">
			{/* CHAMPION */}
			<div className="w-64 mx-auto relative">
				<div style={{ top: '48px' }} className="absolute w-64 mx-auto">
					<div className="mx-auto w-56">{meral && <MeralThumbnail nft={meral} />}</div>
				</div>
				<div className="absolute w-64 mx-auto top-8">
					<img className="mx-auto w-56" style={{ width: '224px', height: '200px' }} src={championFrame} alt="" />
				</div>

				{meral && (
					<div style={styleTokenId} className="absolute w-64 mx-auto px-1 text-xs text-center">
						<span className="mx-auto bg-white rounded-md shadow px-4">#{meral.tokenId.toString().padStart(4, '0')}</span>
					</div>
				)}
			</div>

			<p className="absolute top-0 w-full text-center px-2 bg-yellow-200 text-sm font-light">CURRENT CHAMPION</p>

			{/* SEASON */}
			<div className="flex w-full items-center justify-between absolute text-xs bottom-2 mb-2">
				<div className="pl-4 text-yellow-200">Next season begins in 21 Days</div>
				<div className="mr-4 px-2 border-2 border-yellow-200 py-1 rounded-md shadow-sm text-yellow-400 font-bold">REWARDS</div>
			</div>
		</div>
	);
};
export default Champions;
