import React, { useContext, useState, useEffect, createContext } from 'react';

import { Contract } from '@ethersproject/contracts';
import getSigner from '../constants/Signer';

import { useWeb3 } from './Web3Context';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

// CONTEXT
const ContractBattleContext = createContext();

// CONTRACTS
export function useContractBattle() {
	return useContext(ContractBattleContext);
}

// PROVIDER
export default function ContractBattleProvider({ children }) {
	const provider = useWeb3();
	const [contractBattle, setContractBattle] = useState(undefined);

	useEffect(() => {
		getContracts(provider);
	}, [provider, contractBattle]);

	const getContracts = async (_provider) => {
		if (_provider) {
			await setContractBattle(new Contract(Addresses.EternalBattle, abis.EternalBattle, getSigner(_provider)));
			console.log('GOT BATTLE CONTRACTS');
		} else {
		}
	};

	return <ContractBattleContext.Provider value={contractBattle}>{children}</ContractBattleContext.Provider>;
}
