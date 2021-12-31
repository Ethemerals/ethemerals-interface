import { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import useUserAccount from '../../../hooks/useUserAccount';

import { useNFTUtils } from '../../../hooks/useNFTUtils';

import Spinner from '../../Spinner';
import SVGRevive from '../svg/SVGRevive';
import SVGUnstake from '../svg/SVGUnstake';

import { useWildsNFTStats } from '../../../hooks/useWilds';
import { useMeralColor } from '../../../hooks/useColorTraits';
import { useMeralImagePaths, useChooseMeralImagePaths } from '../../../hooks/useMeralImagePaths';
import { GET_NFT_WILDS } from '../../../queries/SubgraphWilds';
import { useGQLQuery } from '../../../hooks/useGQLQuery';
import WildsUnstake from '../actions/WildsUnstake';
import WildsRevive from '../actions/WildsRevive';

const EmptyWildsCard = ({ stakeType }) => {
	return (
		<>
			<div style={{ width: '280px' }} className="flex h-74 mb-1 mx-1 cursor-pointer hover:shadow-xl bg-white opacity-50 hover:opacity-100 transition duration-300 relative">
				<div className="center text-xs text-gray-500">empty</div>
			</div>
		</>
	);
};

export default EmptyWildsCard;
