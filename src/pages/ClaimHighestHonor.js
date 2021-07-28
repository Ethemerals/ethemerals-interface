import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import { useReadyToTransact } from '../hooks/Web3Context';
import { useSendTx } from '../hooks/TxContext';
import { useCoreContract } from '../hooks/useCore';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { useCore } from '../hooks/useCore';
import { GET_NFT } from '../queries/Subgraph';
import useParseAction from '../hooks/useParseActions';

import { shortenAddress, formatELF } from '../utils';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';

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

const ClaimHighestHonor = () => {
	const history = useHistory();
	const { core } = useCore();

	const { contractCore } = useCoreContract();

	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const { id } = useParams();
	const { data, status, isLoading } = useGQLQuery(`nft_${id}`, GET_NFT, { id: id }, { refetchOnMount: true });

	const [nft, setNFT] = useState({});
	const [ready, setReady] = useState(false);

	// TRANSACTIONS
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	useEffect(() => {
		if (status === 'success' && data && data.ethemeral) {
			setNFT(data.ethemeral);
			setReady(true);
		}
	}, [status, data]);

	const onSubmitRedeemWinnerFunds = async () => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let id = nft.id;
				const gasEstimate = await contractCore.estimateGas.redeemWinnerFunds(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.redeemWinnerFunds(id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Claim Highest Honor', true, [`nft_${id}`, 'account', 'core']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Claim Highest Honor rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			// connect
			console.log('no wallet');
		}
	};

	if (!ready || isLoading !== false || status !== 'success') {
		return <p>Loading {id}</p>;
	}

	return (
		<div>
			<div className="page_bg"></div>
			<h1>Claim Highest Honor</h1>
			<button type="button" onClick={() => history.goBack()}>
				Go back
			</button>
			<br></br>

			<div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl bg-gray-900">
					<div className="flex justify-end"></div>
					<div className="text-center p-4">
						<p className="text-2xl">Claim Honor Fund</p>
						<p className="text-sm text-gray-200">You are about to claim the highest honor fund:</p>
						{core && (
							<>
								<p>{`${formatELF(core.winnerFunds)} ELF`}</p>
								<p>For owning the winning Ethemeral:</p>
								<p>{`#${nft.id} ${nft.metadata.coin}`}</p>
								<p className="text-sm">{`note: claiming will reset the rewards share percentage multiplier back to 1% (currently: ${core.winnerMult}%)`}</p>
							</>
						)}

						{contractCore && (
							<button onClick={onSubmitRedeemWinnerFunds} className="bg-brandColor text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
								Claim
							</button>
						)}
					</div>
				</div>
			</div>

			<div className="w-420 p-4 m-4 bg-gray-700 rounded shadow-lg">
				<h2 className="capitalize">{`${nft.metadata.coin} #${nft.id}`}</h2>
				<p>{nft.edition} of 10</p>

				<p>{nft.score} Honor Points</p>
				<p>{formatELF(nft.rewards)} Ethemeral Life Force</p>
				<h4 className="text-xl pt-2">Stats:</h4>
				<ul>
					<li>{nft.metadata.subClass}</li>
					<li>Special: {nft.metadata.special1}</li>
					<li>attack: {nft.metadata.attack}</li>
					<li>defence: {nft.metadata.defence}</li>
					<li>speed: {nft.metadata.speed}</li>
					<li>artist: {nft.metadata.artist}</li>
					<li>creator: {shortenAddress(nft.creator.id)}</li>
					<li>owner: {shortenAddress(nft.owner.id)}</li>
					<li>mint date: {nft.timestamp}</li>
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

				<h4 className="text-xl pt-2">Actions:</h4>
				<ul>{status === 'success' && nft && nft.actions.length > 0 && nft.actions.map((action, index) => <li key={index}>{ActionLink(action)}</li>)}</ul>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Draining all Life Force from an Ethemeral!" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default ClaimHighestHonor;
