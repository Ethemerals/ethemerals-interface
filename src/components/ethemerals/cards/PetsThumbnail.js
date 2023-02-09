import { useState } from 'react';
import { getPetBorderColor, getPetImages } from '../../../hooks/usePets';
import { animated, useSpring, config } from '@react-spring/web';

const RankedStars = ({ amount }) => {
	const starSVG = (
		<svg width="16" height="16" fill="gold" stroke="goldenRod" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
			/>
		</svg>
	);
	let stars = new Array(amount).fill(0);

	return (
		<>
			{stars.map((star, index) => (
				<span key={index} style={{ marginLeft: '-3px' }}>
					{starSVG}
				</span>
			))}
		</>
	);
};

const PetsThumbnail = ({ nft, select }) => {
	const [isHovered, setIsHovered] = useState(false);

	const styleHover = useSpring({
		backgroundColor: getPetBorderColor(nft.rarity),
		transform: isHovered ? `translate(0px, 8px)` : `translate(0px, 70px)`,
		config: config.stiff,
	});

	const styleTokenId = {
		right: '-8px',
		top: '-8px',
		color: getPetBorderColor(nft.rarity),
	};

	if (!nft) {
		return <p>Loading</p>;
	}

	return (
		<>
			<div onClick={() => select(nft.tokenId)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="w-26 h-28 text-xs relative">
				<div
					style={{ borderColor: getPetBorderColor(nft.rarity), backgroundColor: getPetBorderColor(nft.rarity) }}
					className="w-26 h-28 relative overflow-hidden rounded-lg bg-contain border-2 shadow-md hover:shadow-lg cursor-pointer"
				>
					{/* MAIN IMAGE */}

					<img className="rounded-lg" style={{ backgroundColor: 'hsl(186, 33%, 94%)', width: '104px', height: '104px' }} src={getPetImages(nft.baseId).preview} alt="" />

					{/* BOTTOM BAR */}
					<animated.div style={styleHover} className="w-full bottom-0 absolute text-white pb-2">
						<p className="text-sm font-medium whitespace-nowrap pt-3">{nft.name && nft.name.length > 0 ? nft.name : ''}</p>

						<div style={{ top: '-18px' }} className="text-xs absolute font-bold mx-auto flex items-center w-min my-2 shadow-lg rounded overflow-hidden right-0">
							<div style={{ backgroundColor: `hsla(0,100%,40%,1)`, paddingLeft: '2px', paddingRight: '2px', paddingTop: '1px', paddingBottom: '1px' }}>{nft.atk}</div>
							<div style={{ backgroundColor: `hsla(200,100%,40%,1)`, paddingLeft: '2px', paddingRight: '2px', paddingTop: '1px', paddingBottom: '1px' }}>{nft.def}</div>
							<div style={{ backgroundColor: `hsla(115,100%,40%,1)`, paddingLeft: '2px', paddingRight: '2px', paddingTop: '1px', paddingBottom: '1px' }}>{nft.spd}</div>
						</div>
					</animated.div>
				</div>

				{/* TOP BAR */}
				<div style={{ top: '-7px', left: '-2px' }} className="flex absolute">
					<RankedStars amount={parseInt(nft.rarity)} />
				</div>
				<div style={styleTokenId} className="absolute px-1 bg-white rounded-md shadow">
					#<span className="text-xs">{nft.id.toString().padStart(4, '0')}</span>
				</div>
			</div>
		</>
	);
};

export default PetsThumbnail;
