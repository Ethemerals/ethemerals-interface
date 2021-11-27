import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BigNumber } from '@ethersproject/bignumber';
import { utils } from 'ethers';

import Addresses from '../constants/contracts/Addresses';

import { shortenAddress, formatELF, formatETH } from '../utils';

import { useSendTx } from '../hooks/TxContext';
import { useCoreContract, useCore, useCoreAccount } from '../hooks/useCore';
import { useEquipableContract } from '../hooks/useEquipable';
import { useTokenContract } from '../hooks/useToken';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';
import { useWeb3 } from '../hooks/Web3Context';
import useUserAccount from '../hooks/useUserAccount';

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

const getItemSupply = async (contract, setEquipItemSupply) => {
	try {
		const value = await contract.itemSupply();
		setEquipItemSupply(value.toString());
	} catch (error) {
		console.log(error);
	}
};

const getPetSupply = async (contract, setEquipPetSupply) => {
	try {
		const value = await contract.petSupply();
		setEquipPetSupply(value.toString());
	} catch (error) {
		console.log(error);
	}
};

const getBalance = async (provider, setContractBalance) => {
	const balance = await provider.getBalance(Addresses.Ethemerals);
	setContractBalance(balance.toString());
};

const Admin = () => {
	const { register, handleSubmit } = useForm();

	const provider = useWeb3();
	const { core } = useCore();
	const { accountCore } = useCoreAccount();
	// const { accountEternalBattle } = useEternalBattleAccount();
	const { contractCore } = useCoreContract();
	const { contractToken } = useTokenContract();
	const { contractEquipable } = useEquipableContract();
	// const { contractBattle } = useEternalBattleContract();

	const { address } = useUserAccount();
	const sendTx = useSendTx();

	// core contract
	const [ethemeral, setEthemeral] = useState(undefined);
	const [approved, setApproved] = useState(undefined);
	const [isApprovedForAll, setIsApprovedForAll] = useState(undefined);
	const [tokenURI, setTokenURI] = useState(undefined);

	// equip contract
	const [itemSupply, setItemSupply] = useState(undefined);
	const [petSupply, setPetSupply] = useState(undefined);
	const [equipableURI, setEquipableURI] = useState(undefined);

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

	const onSubmitMint = async () => {
		if (contractCore) {
			setIsConfirmationOpen(true);
			let amount = 1;
			try {
				let value = await contractCore.mintPrice();
				value = value.mul(BigNumber.from(amount));

				const gasEstimate = await contractCore.estimateGas.mintMeral(address, { value });
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.mintMeral(address, { value, gasLimit });
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
		if (contractCore) {
			setIsConfirmationOpen(true);
			let amount = 3;
			try {
				let value = await contractCore.mintPrice();
				value = value.mul(BigNumber.from(amount));

				const gasEstimate = await contractCore.estimateGas.mintMerals(address, { value });
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.mintMerals(address, { value, gasLimit });
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
		if (contractCore) {
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
		if (contractCore) {
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
		if (contractCore) {
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
		if (contractCore) {
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

	const onSubmitAddDelegateEquipable = async (data) => {
		if (contractEquipable) {
			setIsConfirmationOpen(true);
			try {
				let delegate = data.addDelegateEquipable_delegate;
				let add = data.addDelegateEquipable_add;
				const gasEstimate = await contractEquipable.estimateGas.addDelegate(delegate, add);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractEquipable.addDelegate(delegate, add, { gasLimit });
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
		if (contractCore) {
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

	const onSubmitSetEquipableBaseURI = async (data) => {
		if (contractEquipable) {
			setIsConfirmationOpen(true);
			try {
				let uri = data.setEquipableBaseURI_uri;
				const gasEstimate = await contractEquipable.estimateGas.setBaseURI(uri);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractEquipable.setBaseURI(uri, { gasLimit });
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

	const onSubmitRedeemPet = async (data) => {
		if (contractEquipable) {
			setIsConfirmationOpen(true);
			try {
				let id = data.redeemPet_id;
				const gasEstimate = await contractEquipable.estimateGas.redeemPet(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractEquipable.redeemPet(id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, `Redeemed Pet ${id}`, true, ['account', 'account_core']);
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
				<div className="h-10"></div>
				{/* EQUIPABLE CONTRACT */}
				<hr />
				<h2>EQUIPABLE Contract</h2>
				{contractBalance && <p>{`ETH Balance: ${formatETH(contractBalance)} ETH`}</p>}
				<button onClick={() => getPetSupply(contractEquipable, setPetSupply)} className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300">
					PetSupply: {petSupply}
				</button>
				<br></br>
				<button onClick={() => getItemSupply(contractEquipable, setItemSupply)} className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300">
					ItemSupply: {itemSupply}
				</button>
				<br></br>
				<button
					onClick={handleSubmit((data) => getTokenURI(contractEquipable, data.equipableURI_id, setEquipableURI))}
					className="bg-gray-800 text-xs px-4 py-2 m-2 rounded hover:bg-yellow-400 transition duration-300"
				>
					TokenURI: {equipableURI}
				</button>
				<input className="text-black w-24" {...register('equipableURI_id')} />
				<br></br>
				<button onClick={handleSubmit(onSubmitAddDelegateEquipable)} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Add Delegate
				</button>
				<input className="text-black w-96" {...register('addDelegateEquipable_delegate')} />
				<input type="checkbox" className="text-black w-24" {...register('addDelegateEquipable_add')} />
				TRUE: Add | FALSE: Remove
				<br></br>
				<button onClick={handleSubmit(onSubmitSetEquipableBaseURI)} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Set Base URI
				</button>
				<input className="text-black w-96" {...register('setEquipableBaseURI_uri')} />
				<br></br>
				<button onClick={handleSubmit(onSubmitRedeemPet)} className="bg-brandColor text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
					Redeem Pet
				</button>
				<input className="text-black w-24" {...register('redeemPet_id')} />
				<br></br>
				<br></br>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Admin" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default Admin;
