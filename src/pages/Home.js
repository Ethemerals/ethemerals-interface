import { useState, useEffect } from 'react';

import { BigNumber } from '@ethersproject/bignumber';

import FunctionTx from '../constants/FunctionTx';
import { shortenAddress, formatELF, formatETH } from '../utils';

import { useWeb3, useAddress, useOnboard, useLogin, useReadyToTransact } from '../hooks/Web3Context';
import { useSendTx } from '../hooks/TxContext';
import { useCoreContract, useCore } from '../hooks/useCore';
import { useTokenContract } from '../hooks/useToken';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';

const requiredElfDiscount = 2000;

const isDiscountable = async (contractToken, address, setDiscountable) => {
	try {
		const value = await contractToken.balanceOf(address);
		let elfBalance = 0;
		if (value) {
			elfBalance = formatELF(value);
		}
		if (elfBalance >= requiredElfDiscount) {
			setDiscountable(true);
		} else {
			setDiscountable(false);
		}
	} catch (error) {
		console.log(error);
	}
};

const Home = () => {
	const { core } = useCore();
	const { contractCore } = useCoreContract();
	const { contractToken } = useTokenContract();

	const provider = useWeb3();
	const address = useAddress();
	const onboard = useOnboard();
	const login = useLogin();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [discountable, setDiscountable] = useState(false);
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
			isDiscountable(contractToken, address, setDiscountable);
		}
	}, [contractToken, address]);

	const onSubmitBuy = async () => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let value = await contractCore.mintPrice();
				if (discountable) {
					value = value.mul(BigNumber.from(10000).sub(BigNumber.from(2000))).div(BigNumber.from(10000));
				}
				const gasEstimate = await contractCore.estimateGas.buy({ value });
				const gasLimit = gasEstimate.add(gasEstimate.div(FunctionTx.buy.gasDiv));
				const tx = await contractCore.buy({ value, gasLimit });
				console.log(tx);
				sendTx(tx.hash, FunctionTx.buy.receiptMsg, true, ['account']);
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
				<div className=" w-11/12 max-w-420 h-96 center overflow-hidden z-30 tracking-wide p-4">
					<h2>Contract</h2>
					{core && (
						<>
							<p>Contract Address: {shortenAddress(core.id)}</p>
							<p>{`Mint / Revive Price: ${formatETH(core.mintPrice, 6)} ETH`}</p>
							<p>{`Revive Price: ${formatELF(core.revivePrice)} ELF`}</p>
							<p>{`Winner Funds: ${formatELF(core.winnerFunds)} ELF`}</p>
							<p>{`Winner Mult: ${core.winnerMult}`}</p>
							<p>{`Winning Coin: ${core.winningCoin}`}</p>
							<p>{discountable ? '20% Discount' : 'No Discount'}</p>
						</>
					)}
					{contractCore && core && (
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
