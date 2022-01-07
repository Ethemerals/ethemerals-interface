import { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { useMeralImagePaths } from '../../../hooks/useMeralImagePaths';
import { useNFTUtils } from '../../../hooks/useNFTUtils';

import Spinner from '../../Spinner';

// import SVGRevive from './svg/SVGRevive';
// import SVGUnstake from './svg/SVGUnstake';

// import EBDetails from './modals/EBDetails';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const StakedEscrowL1Card = ({ nft }) => {
	const { elements } = useNFTUtils();

	const { meralImagePaths } = useMeralImagePaths(nft.id);

	if (!meralImagePaths) {
		return null;
	}

	const bgImg = meralImagePaths.thumbnail;

	return (
		<>
			<div style={{ backgroundColor: elements[nft.bgId].color, width: '280px' }} className="flex h-74 mb-1 mx-1 cursor-pointer hover:shadow-xl  opacity-90 hover:opacity-100 transition duration-300">
				<div className="relative">
					<img width="74" height="74" src={bgImg} alt="" />
					<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.id.padStart(4, '0')}</span>
				</div>

				<div style={{ width: '214px' }} className="bg-white">
					<h4 style={{ backgroundColor: elements[nft.bgId].color }} className="font-bold text-md uppercase pl-1 overflow-hidden whitespace-nowrap">
						{nft.metadata.coin}
					</h4>
					<div className="text-black w-full px-1 text-xs flex items-end font-bold">
						{nft ? (
							<div>
								<p>
									<span className="text-gray-500 font-light">HP:</span>
									<span className="pl-1">{parseInt(nft.score)}</span>
								</p>
								<p>
									<span className="text-gray-500 font-light">ELF:</span>
									<span className="pl-1">{parseInt(nft.rewards)}</span>
								</p>
							</div>
						) : (
							<Spinner color="text-gray-300" size="h-12 w-12" margin="py-2" />
						)}

						<div className="flex-grow"></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default StakedEscrowL1Card;
