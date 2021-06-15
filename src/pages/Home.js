import { useState, useEffect } from 'react';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_CORE } from '../queries/Subgraph';

import { BigNumber } from '@ethersproject/bignumber';

import Addresses from '../constants/contracts/Addresses';
import { shortenAddress, formatELF, formatETH } from '../utils';

import { useWeb3, useAddress, useOnboard, useLogin, useContractCore, useContractToken, useReadyToTransact } from '../hooks/Web3Context';
import TokenMethods from '../hooks/ContractElf';
import { useSendTx } from '../hooks/TxContext';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';

const requiredElfDiscount = 2000;

const Home = () => {
	const { data, status } = useGQLQuery('core', GET_CORE, { id: Addresses.Ethemerals });

	const provider = useWeb3();
	const address = useAddress();
	const onboard = useOnboard();
	const login = useLogin();
	const contractCore = useContractCore();
	const contractToken = useContractToken();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [core, setCore] = useState({});
	const [ready, setReady] = useState(false);
	const [discountable, setDiscountable] = useState(false);
	const [discountPrice, setDiscountPrice] = useState(false);
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
		if (status === 'success' && data && data.core) {
			setCore(data.core);
			setReady(true);
		}
	}, [status, data]);

	useEffect(() => {
		if (contractToken) {
			isDiscountable();
		}
	}, [contractToken, address]);

	const onSubmitBuy = async () => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let value = await contractCore.mintPrice();
				console.log(formatETH(value));
				if (discountable) {
					value = value.mul(BigNumber.from(10000).sub(BigNumber.from(2000))).div(BigNumber.from(10000));
				}
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

	const isDiscountable = async () => {
		try {
			const value = await contractToken.balanceOf(address);
			let elfBalance = 0;
			if (value) {
				elfBalance = formatELF(value);
			}
			if (elfBalance >= requiredElfDiscount) {
				setDiscountable(true);
				console.log(core.mintPrice);
				// console.log(BigNumber.from(core.mintPrice));
				// setDiscountPrice(
				// 	BigNumber.from(core.mintPrice)
				// 		.mul(BigNumber.from(10000).sub(BigNumber.from(2000)))
				// 		.div(BigNumber.from(10000))
				// );
			} else {
				setDiscountable(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<h1>Home</h1>
			<div className="w-full h-full flex justify-center fixed top-0 left-0">
				<div className=" w-11/12 max-w-420 h-96 center overflow-hidden z-30 tracking-wide p-4">
					<h2>Contract</h2>
					{ready && (
						<>
							<p>Contract Address: {shortenAddress(core.id)}</p>
							<p>Contract Owner: {shortenAddress(core.owner)}</p>
							<p>{`Mint / Revive Price: ${formatETH(core.mintPrice, 6)} ETH`}</p>
							<p>{`Revive Price: ${formatELF(core.revivePrice)} ELF`}</p>
							<p>{`Winner Funds: ${formatELF(core.winnerFunds)} ELF`}</p>
							<p>{discountable ? '20% Discount' : 'No Discount'}</p>
						</>
					)}
					{contractCore && ready && (
						<button onClick={onSubmitBuy} className="bg-brandColor text-xl text-bold px-4 py-2 center my-10 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
							{`mint for ${formatETH(core.mintPrice, 3)} ETH`}
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
