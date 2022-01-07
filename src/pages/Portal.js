import { useState, useEffect } from 'react';

import { BigNumber } from '@ethersproject/bignumber';

import { Links } from '../constants/Links';

import Images from '../constants/Images';

import { useSendTx } from '../context/TxContext';

import { useCore, useCoreContract } from '../hooks/useCore';
import { useEscrowL1Contract } from '../hooks/useEscrowL1';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';

import { useLogin } from '../context/Web3Context';
import useUserAccount from '../hooks/useUserAccount';
import PortalCard from '../components/portal/PortalCard';

const Portal = () => {
	const { mainIndex, userNFTs, account } = useUserAccount();
	const login = useLogin();

	const { contractEscrowL1 } = useEscrowL1Contract();

	const sendTx = useSendTx();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const [userNFT, setUserNFT] = useState(undefined);
	useEffect(() => {
		if (userNFTs && userNFTs.length > 0 && mainIndex >= 0) {
			let _userNFT = userNFTs[mainIndex];
			setUserNFT(_userNFT);
		}
	}, [userNFTs, mainIndex]);

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const handleDeposit = async () => {
		if (contractEscrowL1 && userNFT) {
			setIsConfirmationOpen(true);
			try {
				let id = userNFT.id;
				console.log(id);
				const gasEstimate = await contractEscrowL1.estimateGas.deposit(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractEscrowL1.deposit(id, { gasLimit });
				console.log(tx);

				sendTx(tx.hash, 'enter portal', true, ['account', `nft_${id}`, 'account_escrow_l1']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Transfer transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
			// toggle();
		} else {
			// connect
			console.log('no wallet');
		}
	};

	return (
		<div>
			<div style={{ maxWidth: '500px' }} className="my-8 w-11/12 sm:my-10 sm:w-full mx-auto bg-white p-6 pt-20 pb-10 rounded-lg bg-opacity-80">
				<div className="text-xl text-red-500 text-center">RINKEBY TESTNET</div>

				{contractEscrowL1 ? (
					<div
						onClick={handleDeposit}
						className="text-center mx-auto border-2 border-pink-200 shadow-md sm:mx-8 mt-8 py-2 px-4 cursor-pointer rounded-lg font-bold text-2xl bg-blue-400 hover:bg-yellow-400 text-white transition duration-300 "
					>
						<p className="">Enter The Portal</p>
					</div>
				) : (
					<div
						onClick={login}
						className="text-center mx-auto border-2 border-pink-200 shadow-md sm:mx-8 mt-8 py-2 px-4 cursor-pointer rounded-lg font-bold text-2xl bg-blue-400 hover:bg-yellow-400 text-white transition duration-300 "
					>
						<p className="">Connect</p>
					</div>
				)}
			</div>
			<PortalCard />
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Enter The portal to Polygon" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default Portal;