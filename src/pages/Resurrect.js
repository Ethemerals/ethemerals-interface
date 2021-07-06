import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { utils, BigNumber } from 'ethers';

import { useWeb3, useAddress, useOnboard, useLogin, useReadyToTransact } from '../hooks/Web3Context';
import { useSendTx } from '../hooks/TxContext';
import { useCoreContract, useCore } from '../hooks/useCore';

import Addresses from '../constants/contracts/Addresses';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_NFT } from '../queries/Subgraph';
import useParseAction from '../hooks/useParseActions';

import { shortenAddress, formatELF, formatETH } from '../utils';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';
import { useTokenContract } from '../hooks/useToken';

const getAllowance = async (contract, owner, spender, setAllowance) => {
	try {
		const value = await contract.allowance(owner, spender);
		setAllowance(value);
	} catch (error) {
		console.log(error);
	}
};

const getRevivePrice = async (contract, setRevivePrice) => {
	try {
		const value = await contract.revivePrice();
		setRevivePrice(value);
	} catch (error) {
		console.log(error);
	}
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

const Resurrect = () => {
	const history = useHistory();

	const { core } = useCore();
	const { contractCore } = useCoreContract();
	const { contractToken } = useTokenContract();

	const provider = useWeb3();
	const address = useAddress();
	const onboard = useOnboard();
	const login = useLogin();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const { id } = useParams();
	const { data, status, isLoading } = useGQLQuery(`nft_${id}`, GET_NFT, { id: id });

	const [nft, setNFT] = useState({});
	const [ready, setReady] = useState(false);
	const [allowance, setAllowance] = useState(undefined);
	const [revivePrice, setRevivePrice] = useState(undefined);
	const [isApproved, setIsApproved] = useState(false);

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
		if (contractToken) {
			getAllowance(contractToken, address, Addresses.Ethemerals, setAllowance);
		}
	}, [contractToken, address, Addresses, setAllowance]);

	useEffect(() => {
		if (contractCore) {
			getRevivePrice(contractCore, setRevivePrice);
		}
	}, [contractCore, setRevivePrice]);

	useEffect(() => {
		if (allowance && revivePrice) {
			setIsApproved(allowance.gte(revivePrice));
		}
	}, [allowance, revivePrice]);

	useEffect(() => {
		if (status === 'success' && data && data.ethemeral) {
			setNFT(data.ethemeral);
			setReady(true);
		}
	}, [status, data]);

	// check approved

	// approve

	const onSubmitResurrect = async (withETH) => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let id = nft.id;
				if (withETH) {
					let value = await contractCore.mintPrice();
					const gasEstimate = await contractCore.estimateGas.resurrectWithEth(id, { value });
					const gasLimit = gasEstimate.add(gasEstimate.div(9));
					const tx = await contractCore.resurrectWithEth(id, { value, gasLimit });
					console.log(tx);
					sendTx(tx.hash, 'Resurrect Ethemeral', true, ['account', `nft_${id}`]);
				} else {
					let value = await contractCore.revivePrice();
					value = await contractToken.balanceOf(address);
					const gasEstimate = await contractCore.estimateGas.resurrectWithToken(id, { from: address });
					const gasLimit = gasEstimate.add(gasEstimate.div(9));
					const tx = await contractCore.resurrectWithToken(id, { from: address, gasLimit });
					console.log(tx);
					sendTx(tx.hash, 'Resurrect Ethemeral', true, ['account', `nft_${id}`]);
				}
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Resurrect transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			// connect
			console.log('no wallet');
		}
	};

	const onSubmitApprove = async () => {
		if (contractToken && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				const mult = BigNumber.from('100');
				const value = revivePrice.mul(mult);
				console.log(value.toString());
				const gasEstimate = await contractToken.estimateGas.approve(Addresses.Ethemerals, value);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractToken.approve(Addresses.Ethemerals, value, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Approve ELF Spend limit', true, ['account']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Approve transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			// connect
			console.log('no wallet');
		}
	};

	if (!ready || isLoading !== false || status !== 'success' || !core || !contractCore) {
		return <p>Loading {id}</p>;
	}

	return (
		<div>
			<h1>Resurrect</h1>
			<button type="button" onClick={() => history.goBack()}>
				Go back
			</button>
			<br></br>
			<p>{`Revive Price: ${formatETH(core.mintPrice, 6)} ETH`}</p>
			<p>{`Revive Price: ${formatELF(core.revivePrice)} ELF`}</p>
			<div>
				<button onClick={() => onSubmitResurrect(true)} className="bg-brandColor text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Resurrect with ETH
				</button>
				{!isApproved && (
					<button onClick={onSubmitApprove} className="bg-brandColor text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
						Approve ELF
					</button>
				)}
				{isApproved && (
					<button onClick={() => onSubmitResurrect(false)} className="bg-brandColor text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
						Resurrect with ELF
					</button>
				)}
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
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Resurrect an Ethemeral from the ashes" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default Resurrect;
