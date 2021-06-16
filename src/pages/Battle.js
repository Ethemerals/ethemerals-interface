import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGQLQuery, useUniGQLQuery } from '../hooks/useGQLQuery';
import { GET_POOL } from '../queries/UniSubgraph';

import { shortenAddress, formatELF, formatETH } from '../utils';

const WBTC_USDC = '0x99ac8ca7087fa4a2a1fb6357269965a2014abc35';

const Battle = () => {
	const { data, status } = useUniGQLQuery('WBTC_USDC', GET_POOL, { id: WBTC_USDC });

	const [ready, setReady] = useState(false);
	const [WBTCUSDCPool, setWBTCUSDCPool] = useState(undefined);

	useEffect(() => {
		if (status === 'success' && data && data.pool) {
			setWBTCUSDCPool(data.core);
			setReady(true);
		}
	}, [status, data]);

	useEffect(() => {
		if (WBTCUSDCPool) {
			console.log(WBTCUSDCPool);
		}
	}, [WBTCUSDCPool]);

	return (
		<div>
			<h1>Battle</h1>
			<h2>Eternal Battle</h2>
			<div className="w-420 h-64 bg-gray-700 p-4 m-4">
				<h3>Bitcoin vs USDC</h3>
				<button className="p-2 m-2 rounded bg-brandColor-purple">Join Bitcoin</button>
				<button className="p-2 m-2 rounded bg-brandColor-purple">Join USDC</button>
				<p>BTC/USDC</p>
				<p>Price:</p>
				<p>1hr percentage</p>
				<p>24h vol:</p>
			</div>
		</div>
	);
};

export default Battle;
