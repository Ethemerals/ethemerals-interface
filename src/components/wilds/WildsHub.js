import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GET_LAND } from '../../queries/SubgraphWilds';
import { useGQLQuery } from '../../hooks/useGQLQuery';

import WildsStake from './actions/WildsStake';
import WildsUnstake from './actions/WildsUnstake';
import WildsRaidActions from './actions/WildsRaidActions';
import StakedWildsCard from './cards/stakedWildsCard';
import { useWildsContract, wildsParseInitValues } from '../../hooks/useWilds';
import EmptyWildsCard from './cards/emptyWildsCard';
import Onsen from '../onsen/Onsen';

const worldMap = 'https://ethemerals-media.s3.amazonaws.com/wilds/worldmap.png';

const WildsHub = () => {
	return (
		<div style={{ backgroundImage: `url(${worldMap})` }} className="h-screen w-full bg-center object-none fixed overflow-y-auto px-4">
			<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white mt-16 mb-4 w-96">
				<h1>Hub</h1>
			</div>
			<Onsen />
		</div>
	);
};

export default WildsHub;
