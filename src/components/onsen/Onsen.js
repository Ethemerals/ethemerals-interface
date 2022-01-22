import { useEffect, useState } from 'react';

import { useOnsenAccount, useOnsenContract } from '../../hooks/useOnsen';
import OnsenStake from './actions/OnsenStake';
import StakedOnsenCard from './cards/stakedOnsenCard';

const WildsOnsen = () => {
	const { contractOnsen } = useOnsenContract();
	const { accountOnsen } = useOnsenAccount();

	const [stakedNFT, setStakedNFT] = useState(undefined);

	useEffect(() => {
		if (accountOnsen) {
			let _stakedNFT = [];
			accountOnsen.ethemerals.forEach((nft) => {
				_stakedNFT.push(nft);
			});
			setStakedNFT(_stakedNFT);
		}
	}, [accountOnsen]);

	return (
		<div className="bg-gray-200 bg-opacity-80 p-4 border-4 border-white my-4 w-96 h-44 cursor-pointer hover:bg-blue-100">
			<h1>Onsen</h1>
			<OnsenStake contractOnsen={contractOnsen} />
			<p>Under Construction</p>
			{/* <h4>Currenty Staked</h4> */}
			{stakedNFT && stakedNFT.length > 0 && stakedNFT.map((nft) => <StakedOnsenCard key={nft.id} nft={nft} contractOnsen={contractOnsen} />)}
		</div>
	);
};

export default WildsOnsen;
