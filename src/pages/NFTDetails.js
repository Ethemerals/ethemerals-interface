import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useSpring, animated, config } from '@react-spring/web';
import dateFormat from 'dateformat';

import { useAddress } from '../hooks/Web3Context';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { useNFTUtils } from '../hooks/useNFTUtils';
import Images from '../constants/Images';
import { GET_NFT } from '../queries/Subgraph';
import useParseAction from '../hooks/useParseActions';

import NFTActions from '../components/modals/NFTActions';

import { shortenAddress, formatELF } from '../utils';

const RankedStars = ({ amount }) => {
	const starSVG = (
		<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
			/>
		</svg>
	);

	let stars = new Array(amount).fill(0);

	return (
		<>
			{stars.map((star, index) => (
				<span key={index}>{starSVG}</span>
			))}
		</>
	);
};

const ActionLink = (action) => {
	const [actionString, txLink] = useParseAction(action);

	return (
		<a href={txLink} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-400">
			{actionString}
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
				<polyline points="15 3 21 3 21 9"></polyline>
				<line x1="10" y1="14" x2="21" y2="3"></line>
			</svg>
		</a>
	);
};

const NFTDetails = () => {
	const address = useAddress();
	const history = useHistory();
	const { getNFTImages, parseScore } = useNFTUtils();

	const { id } = useParams();
	const { data, status, isLoading } = useGQLQuery(`nft_${id}`, GET_NFT, { id: id }, { refetchOnMount: true });

	const [nft, setNFT] = useState({});
	const [ready, setReady] = useState(false);
	const [cmId, setCmId] = useState(undefined);
	const [birthDate, setBirthDate] = useState(Date.now());

	// REACT SPRING
	const styles = useSpring({
		loop: false,
		to: { y: 0 },
		from: { y: -10 },
		config: config.wobbly,
	});

	useEffect(() => {
		if (status === 'success' && data && data.ethemeral) {
			setNFT(data.ethemeral);
			setCmId(data.ethemeral.metadata.cmId);
			setBirthDate(parseInt(nft.timestamp) * 1000);
			setReady(true);
		}
	}, [status, data]);

	if (!ready || isLoading !== false || status !== 'success') {
		return <p>Loading {id}</p>;
	}

	return (
		<div>
			<h1>NFT Details</h1>
			<button type="button" onClick={() => history.goBack()}>
				Go back
			</button>
			{address && <NFTActions nft={nft} />}

			<div style={{ backgroundImage: `url(${getNFTImages(cmId).bg})` }} className="nft_details_bg bg-cover m-6 mx-auto relative overflow-hidden">
				{/* LEFT BAR */}
				<div className="p-4 w-32 z-20 absolute font-bold text-center">
					<img className="w-90 h-74 mx-auto" src={Images.logoEthem} />
					<p className="mt-20 text-lg border-b border-white">{nft.edition}/10</p>
					<p className="text-sm">EDITION</p>
					<p className="mt-2 text-3xl">#{nft.id.padStart(4, '0')}</p>
				</div>

				{/* RIGHT BAR */}
				<div className="m-4 w-64 z-20 right-0 absolute border-white border-r">
					<div className="flex justify-end mx-2">
						<RankedStars amount={parseScore(nft.score)} />
					</div>
					<p className="font-bold text-right mx-2">{nft.score} HP</p>
					<p className="font-bold text-right mx-2">{formatELF(nft.rewards)} ELF</p>
				</div>

				{/* BOTTOM BAR */}
				<div className="px-4 h-40 z-20 w-600 bottom-0 absolute overflow-hidden">
					<p className="font-bold text-5xl uppercase -mx-1">{nft.metadata.coin}</p>
					<div className="flex h-8 my-2">
						<div className="w-8 bg-white">
							<img src={getNFTImages(cmId).subclassIcon} />
						</div>
						<div className=" w-48 px-2 bg-black uppercase text-lg align-middle">{nft.metadata.subClass}</div>
					</div>
					<div className="flex h-3 items-center mb-1 text-sm font-bold">
						<span className="w-8">ATK</span>
						<span style={{ width: `${nft.metadata.attack * 3}px` }} className="h-3 bg-white opacity-20"></span>
						<span className="flex-grow"></span>
						<span className="flex-none opacity-60">Designer: {nft.metadata.artist}</span>
					</div>
					<div className="flex h-3 items-center mb-1 text-sm font-bold">
						<span className="w-8">DEF</span>
						<span style={{ width: `${nft.metadata.defence * 3}px` }} className="h-3 bg-white opacity-20"></span>
						<span className="flex-grow"></span>
						<span className="flex-none opacity-60 font-bold">Birthed On: {dateFormat(birthDate, 'mmm dd yyyy')}</span>
					</div>
					<div className="flex h-3 items-center mb-1 text-sm font-bold">
						<span className="w-8">SPD</span>
						<span style={{ width: `${nft.metadata.speed * 3}px` }} className="h-3 bg-white opacity-20"></span>
						<span className="flex-grow"></span>
						<span className="flex-none opacity-60">Owner: {shortenAddress(nft.owner.id)}</span>
					</div>
				</div>

				{/* MAIN IMAGE */}
				<div className="">
					<img style={styles} className="object-fit w-full animate-bounceSlow" src={getNFTImages(cmId).tall} />
				</div>

				{/* <p>{nft.score} Honor Points</p>
				<p>{formatELF(nft.rewards)} Ethemeral Life Force</p>

				<h4 className="text-xl pt-2">Stats:</h4>
				<ul>
					<li>{nft.metadata.subClass}</li>
					<li>Special: {nft.metadata.special1}</li>
				</ul>
				<h4 className="text-xl pt-2">Scorecard:</h4>
				<ul>
					<li>battles: {nft.scorecard.battles}</li>
					<li>wins: {nft.scorecard.wins}</li>
					<li>revived: {nft.scorecard.revived}</li>
					<li>resurrected: {nft.scorecard.resurrected}</li>
					<li>reaped: {nft.scorecard.reaped}</li>
					<li>drained: {nft.scorecard.drained}</li>
				</ul>

				<h4 className="text-xl pt-2">History:</h4>
				<ul>{status === 'success' && nft && nft.actions.length > 0 && nft.actions.map((action, index) => <li key={index}>{ActionLink(action)}</li>)}</ul> */}
			</div>
		</div>
	);
};

export default NFTDetails;
