import { useState, useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';

import Addresses from '../constants/contracts/Addresses';
import FunctionTx from '../constants/FunctionTx';
import { shortenAddress, formatELF, formatETH } from '../utils';

import { useWeb3, useAddress, useReadyToTransact } from '../hooks/Web3Context';
import { useSendTx } from '../hooks/TxContext';
import { useCoreContract, useCore, useCoreAccount } from '../hooks/useCore';
import { useTokenContract } from '../hooks/useToken';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';

const requiredElfDiscount = 2000;

const getBalance = async (provider, setContractBalance) => {
	const balance = await provider.getBalance(Addresses.Ethemerals);
	setContractBalance(balance.toString());
};

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

const Admin = () => {
	const provider = useWeb3();
	const { core } = useCore();
	const { contractCore } = useCoreContract();
	const { accountCore } = useCoreAccount();
	const { contractToken } = useTokenContract();

	const address = useAddress();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [discountable, setDiscountable] = useState(false);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const [contractBalance, setContractBalance] = useState(undefined);

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	useEffect(() => {
		if (provider) {
			getBalance(provider, setContractBalance);
		}
	}, [provider]);

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

	const onSubmitTest = async () => {
		if (contractCore) {
			try {
				let value = await contractCore.getCoinScore(10);
				console.log(value.toString());
			} catch (error) {
				console.log(`${error.data} \n${error.message}`);
			}
		} else {
			// connect
			console.log('no wallet');
		}
	};

	if (!core) {
		return null;
	}

	return (
		<div>
			<h1>Admin</h1>
			<div className="p-4">
				<h2>Contract</h2>
				{core && (
					<>
						<p>Contract Address: {shortenAddress(core.id)}</p>
						{contractBalance && <p>{`ETH Balance: ${formatETH(contractBalance)} ETH`}</p>}
						{accountCore && <p>{`ELF Balance: ${formatELF(accountCore.elfBalance)} ELF`}</p>}

						<p>{`Mint / Revive Price: ${formatETH(core.mintPrice, 6)} ETH`}</p>
						<p>{`Revive Price: ${formatELF(core.revivePrice)} ELF`}</p>
						<p>{`Winner Funds: ${formatELF(core.winnerFunds)} ELF`}</p>
						<p>{`Winner Mult: ${core.winnerMult}`}</p>
						<p>{`Winning Coin: ${core.winningCoin}`}</p>
					</>
				)}
				<div className="flex items-center space-x-3">
					<button onClick={onSubmitBuy} className="bg-brandColor text-bold px-4 py-2 my-10 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
						{`mint for ${formatETH(core.mintPrice, 3)} ETH`}
					</button>
					<button onClick={onSubmitTest} className="bg-brandColor text-bold px-4 py-2 my-10 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
						Test
					</button>
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Admin" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default Admin;
