import { useState, useEffect } from 'react';

import { BigNumber } from '@ethersproject/bignumber';

import FunctionTx from '../constants/FunctionTx';
import { formatELF, formatETH } from '../utils';

import Images from '../constants/Images';

import { useAddress, useLogin, useReadyToTransact } from '../hooks/Web3Context';
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

	const address = useAddress();
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

	const onSubmitMint = async () => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			let amount = 1;
			try {
				let value = await contractCore.mintPrice();
				value = value.mul(BigNumber.from(amount));
				if (discountable) {
					value = value.mul(BigNumber.from(10000).sub(BigNumber.from(1000))).div(BigNumber.from(10000));
				}
				const gasEstimate = await contractCore.estimateGas.mintEthemeral(address, { value });
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.mintEthemeral(address, { value, gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Minted an Ethemeral', true, ['account', 'account_core']);
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

	const onSubmitMints = async () => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			let amount = 3;
			try {
				let value = await contractCore.mintPrice();
				value = value.mul(BigNumber.from(amount));
				value = value.mul(BigNumber.from(10000).sub(BigNumber.from(1000))).div(BigNumber.from(10000));
				if (discountable) {
					value = value.mul(BigNumber.from(10000).sub(BigNumber.from(1000))).div(BigNumber.from(10000));
				}
				const gasEstimate = await contractCore.estimateGas.mintEthemerals(address, { value });
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.mintEthemerals(address, { value, gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Minted 3 Ethemerals', true, ['account', 'account_core']);
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

	const handleOnSubmitBuy = async (amount) => {
		if (contractCore && core) {
			if (amount > 1) {
				onSubmitMints();
			} else {
				onSubmitMint();
			}
		} else {
			login();
		}
	};

	return (
		<div className="scrollbar_pad">
			<div className="bg_home sm:bg-75% lg:bg-50% bg-cover"></div>
			<div className="center">
				{core && (
					<div className="text-center my-8">
						<p className="text-blue-900">Season 1 Ethemeral Characters</p>
						<p className="text-blue-900">{`current supply ${core.ethemeralSupply}/${core.maxAvailableIndex}`}</p>
					</div>
				)}
				<div onClick={() => handleOnSubmitBuy(1)} className="text-blue-900 cursor-pointer w-420">
					<div className="flex justify-center">
						<img width="72" height="72" alt="mintable ethemeral two" src={Images.logoELF} />
					</div>
					{core && (
						<div className="text-center mt-4">
							<p className="font-bold text-3xl">{`Mint 1 for ${formatETH(core.mintPrice, 4)} ETH`}</p>
							<p>{discountable ? 'You hold ELF! 10% Discount will be applied' : 'You dont hold enough ELF for a Discount'}</p>
						</div>
					)}
				</div>
				<div onClick={() => handleOnSubmitBuy(3)} className="text-blue-900 cursor-pointer w-420 mt-10">
					<div className="flex justify-center">
						<img width="72" height="72" alt="mintable ethemeral two" src={Images.logoELF} />
					</div>
					{core && (
						<div className="text-center mt-4">
							<p className="font-bold text-3xl">{`Mint 3 for ${parseFloat(formatETH(core.mintPrice, 3)) * 3 * 0.9} ETH`}</p>
							<p>{discountable ? 'You hold ELF! 10% Discount will be applied' : 'You dont hold enough ELF for a Discount'}</p>
						</div>
					)}
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Mint an Ethemeral, good luck!" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default Home;
