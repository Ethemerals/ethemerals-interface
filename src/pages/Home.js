import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_ACCOUNT, GET_CORE } from '../queries/Subgraph';

import Addresses from '../constants/contracts/Addresses';
import { isAddress, shortenAddress, formatELF, formatETH } from '../utils';

import CoreMethods from '../hooks/ContractCore';
import { useWeb3, useOnboard, useAddress, useBalance, useLogin, useContractCore, useReadyToTransact } from '../hooks/Web3Context';
import { useSendTx } from '../hooks/TxContext';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';

const Home = () => {
	const { data, status, isLoading, error } = useGQLQuery('core', GET_CORE, { id: Addresses.Ethemerals });
	const provider = useWeb3();
	const onboard = useOnboard();
	const login = useLogin();
	const contractCore = useContractCore();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [core, setCore] = useState({});
	const [ready, setReady] = useState(false);
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
		if (data && data.core) {
			setCore(data.core);
			setReady(true);
		}
	}, [status]);

	const onSubmitBuy = async () => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				const value = await contractCore.mintPrice();
				const gasEstimate = await contractCore.estimateGas.buy({ value });
				const gasLimit = gasEstimate.add(gasEstimate.div(9));

				const tx = await contractCore.buy({ value, gasLimit });

				console.log(tx);

				sendTx(tx.hash, 'Minted an Ethemeral');
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Mint transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			// connect
			console.log('no wallet');
		}
	};

	return (
		<div>
			<h1>Home</h1>
			<div className="w-full h-full flex justify-center fixed top-0 left-0">
				<div className=" w-11/12 max-w-420 h-96 center bg-opacity-100 bg-gray-700 rounded-2xl overflow-hidden z-30 tracking-wide p-4">
					<h2>Contract</h2>
					{ready && (
						<>
							<p>Contract Address: {shortenAddress(core.id)}</p>
							<p>Contract Owner: {shortenAddress(core.owner)}</p>
							<p>{`Mint / Revive Price: ${formatETH(core.mintPrice, 6)} ETH`}</p>
							<p>{`Revive Price: ${formatELF(core.revivePrice)} ELF`}</p>
							<p>{`Winner Funds: ${formatELF(core.winnerFunds)} ELF`}</p>
						</>
					)}
					{contractCore && (
						<button onClick={onSubmitBuy} className="bg-brandColor text-xl text-bold px-4 py-2 center my-10 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
							mint
						</button>
					)}
					{!provider && onboard && (
						<button onClick={login} className="bg-brandColor text-xl text-bold px-4 py-2 center my-10 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
							Connect Wallet to Mint
						</button>
					)}
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Mint an Ethemeral, good luck!" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default Home;
