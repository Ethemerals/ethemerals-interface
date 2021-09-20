import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BigNumber } from '@ethersproject/bignumber';
import { utils } from 'ethers';

import Addresses from '../constants/contracts/Addresses';
import FunctionTx from '../constants/FunctionTx';
import { shortenAddress, formatELF, formatETH } from '../utils';

import { useWeb3, useAddress, useReadyToTransact } from '../hooks/Web3Context';
import { useSendTx } from '../hooks/TxContext';
import { useCoreContract, useCore, useCoreAccount } from '../hooks/useCore';
import { useTokenContract } from '../hooks/useToken';
// import { useEternalBattleContract } from '../hooks/useEternalBattle';
// import { useEternalBattleAccount } from '../hooks/useEternalBattle';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';

const requiredElfDiscount = 2000;

// const getReviverScorePenalty = async (contract, setReviverScorePenalty) => {
// 	try {
// 		const value = await contract.reviverScorePenalty();
// 		setReviverScorePenalty(value.toString());
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const getReviverTokenReward = async (contract, setReviverTokenReward) => {
// 	try {
// 		const value = await contract.reviverTokenReward();
// 		setReviverTokenReward(value.toString());
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const getStake = async (contract, id, setStake) => {
// 	try {
// 		const value = await contract.getStake(id);
// 		setStake(value.toString());
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const getChange = async (contract, id, setChange) => {
// 	try {
// 		const value = await contract.getChange(id);
// 		setChange(value.toString());
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

const getEthemeral = async (contract, id, setEthemeral) => {
	try {
		const value = await contract.getEthemeral(id);
		setEthemeral(`${value[0].toString()}, ${value[1].toString()}, ${value[2].toString()}, ${value[3].toString()}, ${value[4].toString()}`);
	} catch (error) {
		console.log(error);
	}
};

const getApproved = async (contract, id, setApproved) => {
	try {
		const value = await contract.getApproved(id);
		setApproved(value);
	} catch (error) {
		console.log(error);
	}
};

const getIsApprovedForAll = async (contract, owner, operator, setIsApprovedForAll) => {
	try {
		const value = await contract.isApprovedForAll(owner, operator);
		setIsApprovedForAll(value.toString());
	} catch (error) {
		console.log(error);
	}
};

const getTokenURI = async (contract, id, setTokenURI) => {
	try {
		const value = await contract.tokenURI(id);
		setTokenURI(value.toString());
	} catch (error) {
		console.log(error);
	}
};

const getContractURI = async (contract, setContractURI) => {
	try {
		const value = await contract.contractURI();
		setContractURI(value.toString());
	} catch (error) {
		console.log(error);
	}
};

const getBalance = async (provider, setContractBalance) => {
	const balance = await provider.getBalance(Addresses.Ethemerals);
	setContractBalance(balance.toString());
};

const isDiscountable = async (contract, address, setDiscountable) => {
	try {
		const value = await contract.balanceOf(address);
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
	const { register, handleSubmit } = useForm();

	const provider = useWeb3();
	const { core } = useCore();
	const { accountCore } = useCoreAccount();
	// const { accountEternalBattle } = useEternalBattleAccount();
	const { contractCore } = useCoreContract();
	const { contractToken } = useTokenContract();
	// const { contractBattle } = useEternalBattleContract();

	const address = useAddress();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	// core contract
	const [availableCoins, setMaxAvailableIndex] = useState(undefined);
	const [currentSupply, setCurrentSupply] = useState(undefined);
	const [ethemeral, setEthemeral] = useState(undefined);
	const [approved, setApproved] = useState(undefined);
	const [isApprovedForAll, setIsApprovedForAll] = useState(undefined);
	const [tokenURI, setTokenURI] = useState(undefined);
	const [contractURI, setContractURI] = useState(undefined);

	// battle contract
	// const [stake, setStake] = useState(undefined);
	// const [change, setChange] = useState(undefined);
	// const [reviverScorePenalty, setReviverScorePenalty] = useState(undefined);
	// const [reviverTokenReward, setReviverTokenReward] = useState(undefined);

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

	const onSubmitWithdraw = async () => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				const gasEstimate = await contractCore.estimateGas.withdraw(Addresses.admin);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.withdraw(Addresses.admin, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'withdraw', true, ['account', 'core', 'account_core']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Withdraw transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			// connect
			console.log('no wallet');
		}
	};

	const onSubmitSetMaxAvailableIndex = async (data) => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let id = data.setAvailableCoin_id;
				const gasEstimate = await contractCore.estimateGas.setMaxMeralIndex(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.setMaxMeralIndex(id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Set max available ethemeral', true, ['core', 'account_core']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			// connect
			console.log('no wallet');
		}
	};

	const onSubmitSetPrice = async (data) => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let price = utils.parseEther(data.setPrice_price);
				const gasEstimate = await contractCore.estimateGas.setPrice(price);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.setPrice(price, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Set Price', true, ['core', 'account_core']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			// connect
			console.log('no wallet');
		}
	};

	const onSubmitAddDelegate = async (data) => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let delegate = data.addDelegate_delegate;
				let add = data.addDelegate_add;
				const gasEstimate = await contractCore.estimateGas.addDelegate(delegate, add);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.addDelegate(delegate, add, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'add delegate', true, ['core', 'account_core']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			// connect
			console.log('no wallet');
		}
	};

	const onSubmitSetBaseURI = async (data) => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let uri = data.setBaseURI_uri;
				const gasEstimate = await contractCore.estimateGas.setBaseURI(uri);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.setBaseURI(uri, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'set uri', true, ['core', 'account_core']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			// connect
			console.log('no wallet');
		}
	};

	// ETERNAL BATTLE FUNCTIONS
	// const onSubmitCancelStakeAdmin = async (data) => {
	// 	if (contractBattle && readyToTransact()) {
	// 		setIsConfirmationOpen(true);
	// 		try {
	// 			let id = data.cancelStakeAdmin_id;
	// 			const gasEstimate = await contractBattle.estimateGas.cancelStakeAdmin(id);
	// 			const gasLimit = gasEstimate.add(gasEstimate.div(9));
	// 			const tx = await contractBattle.cancelStakeAdmin(id, { gasLimit });
	// 			console.log(tx);
	// 			sendTx(tx.hash, 'cancel stake admin', true, ['account_eternalBattle']);
	// 		} catch (error) {
	// 			setIsErrorOpen(true);
	// 			setErrorMsg('Transaction rejected from user wallet');
	// 			console.log(`${error.data} \n${error.message}`);
	// 		}
	// 		setIsConfirmationOpen(false);
	// 	} else {
	// 		// connect
	// 		console.log('no wallet');
	// 	}
	// };

	// const onSubmitSetReviverRewards = async (data) => {
	// 	if (contractBattle && readyToTransact()) {
	// 		setIsConfirmationOpen(true);
	// 		try {
	// 			let score = data.setReviverRewards_score;
	// 			let token = utils.parseEther(data.setReviverRewards_token);
	// 			const gasEstimate = await contractBattle.estimateGas.setReviverRewards(score, token);
	// 			const gasLimit = gasEstimate.add(gasEstimate.div(9));
	// 			const tx = await contractBattle.setReviverRewards(score, token, { gasLimit });
	// 			console.log(tx);
	// 			sendTx(tx.hash, 'set reviver rewards', true, ['account_eternalBattle']);
	// 		} catch (error) {
	// 			setIsErrorOpen(true);
	// 			setErrorMsg('Transaction rejected from user wallet');
	// 			console.log(`${error.data} \n${error.message}`);
	// 		}
	// 		setIsConfirmationOpen(false);
	// 	} else {
	// 		// connect
	// 		console.log('no wallet');
	// 	}
	// };

	// if (!provider || !contractCore || !accountCore || !contractToken || !accountEternalBattle || !contractBattle) {
	// 	return <div>Login</div>;
	// }

	if (!provider || !contractCore || !accountCore || !contractToken) {
		return <div>Login</div>;
	}

	return (
		<div className="bg-gray-500">
			<h1>Admin</h1>
			<div className="p-4">
				<h2>CORE Contract</h2>
				<p>Contract Address: {shortenAddress(core.id)}</p>
				{contractBalance && <p>{`ETH Balance: ${formatETH(contractBalance)} ETH`}</p>}
				{accountCore && <p>{`ELF Balance: ${formatELF(accountCore.elfBalance)} ELF`}</p>}
				<p>{`Mint Price: ${formatETH(core.mintPrice, 6)} ETH`}</p>
				<p>{`Max Index: ${core.maxAvailableIndex} `}</p>
				<p>{`Current Supply: ${core.ethemeralSupply}`}</p>
				<p>{`Latest Index: ${parseInt(core.ethemeralSupply) - 1}`}</p>
				<br></br>
				<button
					onClick={handleSubmit((data) => getEthemeral(contractCore, data.ethemeral_id, setEthemeral))}
					className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300"
				>
					CoinById: {ethemeral}
				</button>
				<input className="text-black w-24" {...register('ethemeral_id')} />
				<br></br>
				<button
					onClick={handleSubmit((data) => getApproved(contractCore, data.approved_id, setApproved))}
					className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300"
				>
					Approved: {approved}
				</button>
				<input className="text-black w-24" {...register('approved_id')} />
				<br></br>
				<button
					onClick={handleSubmit((data) => getIsApprovedForAll(contractCore, data.isApprovedForAll_owner, data.isApprovedForAll_operator, setIsApprovedForAll))}
					className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300"
				>
					Is Approved for All: {isApprovedForAll}
				</button>
				<input className="text-black" {...register('isApprovedForAll_owner')} />
				<input className="text-black ml-4" {...register('isApprovedForAll_operator')} />
				<br></br>
				<button
					onClick={handleSubmit((data) => getTokenURI(contractCore, data.tokenURI_id, setTokenURI))}
					className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300"
				>
					TokenURI: {tokenURI}
				</button>
				<input className="text-black w-24" {...register('tokenURI_id')} />
				<br></br>
				<button onClick={onSubmitMint} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					{`mint 1 for ${formatETH(core.mintPrice, 3)} ETH`}
				</button>
				<br></br>
				<button onClick={onSubmitMints} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					{`mint 3 for ${parseFloat(formatETH(core.mintPrice, 3)) * 3} ETH`}
				</button>
				<br></br>
				<button onClick={onSubmitWithdraw} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Withdraw
				</button>
				<br></br>
				<button onClick={handleSubmit(onSubmitSetMaxAvailableIndex)} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Set Max Ethemerals Index
				</button>
				<input className="text-black w-24" {...register('setAvailableCoin_id')} />
				<br></br>
				<button onClick={handleSubmit(onSubmitSetPrice)} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Set Price
				</button>
				<input className="text-black w-24" {...register('setPrice_price')} />
				TRUE: In ETH | FALSE: Dicount Min Tokens Needed
				<br></br>
				<button onClick={handleSubmit(onSubmitAddDelegate)} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Add Delegate
				</button>
				<input className="text-black w-96" {...register('addDelegate_delegate')} />
				<input type="checkbox" className="text-black w-24" {...register('addDelegate_add')} />
				TRUE: Add | FALSE: Remove
				<br></br>
				<button onClick={handleSubmit(onSubmitSetBaseURI)} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Set Base URI
				</button>
				<input className="text-black w-96" {...register('setBaseURI_uri')} />
				<br></br>
				<h2 className="mt-10">Eternal Battle Contract</h2>
				<p>Contract Address: {shortenAddress(core.id)}</p>
				<br></br>
				{/* <button
					onClick={handleSubmit((data) => getStake(contractBattle, data.setStake_id, setStake))}
					className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300"
				>
					Get Stake: {stake}
				</button>
				<input className="text-black w-24" {...register('setStake_id')} />
				<br></br>
				<button
					onClick={handleSubmit((data) => getChange(contractBattle, data.getChange_id, setChange))}
					className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300"
				>
					Get Change: {change}
				</button>
				<input className="text-black w-24" {...register('getChange_id')} />
				<br></br>
				<button onClick={() => getReviverScorePenalty(contractBattle, setReviverScorePenalty)} className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300">
					Get Reviver Penalty: {reviverScorePenalty}
				</button>
				<br></br>
				<button onClick={() => getReviverTokenReward(contractBattle, setReviverTokenReward)} className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300">
					Get Token Rewards: {reviverTokenReward && formatELF(reviverTokenReward)}
				</button>
				<br></br>
				<button onClick={handleSubmit(onSubmitCancelStakeAdmin)} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Cancel Stake Admin
				</button>
				<input className="text-black w-24" {...register('cancelStakeAdmin_id')} />
				<br></br>
				<button onClick={handleSubmit(onSubmitSetReviverRewards)} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Set Reviver Penalty / Rewards
				</button>
				<input className="text-black w-24" {...register('setReviverRewards_score')} />
				<input className="text-black w-24 ml-4" {...register('setReviverRewards_token')} />
				<br></br> */}
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Admin" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default Admin;
