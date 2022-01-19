import { useEffect, useState } from 'react';
import abis from '../constants/contracts/abis';
import { useWeb3 } from './useWeb3';
import { useAddresses } from './useAddresses';
import { getContract } from './getters/getContract';

export const useEscrowL1Contract = () => {
	const { provider } = useWeb3();
	const { addresses } = useAddresses();
	const address = addresses ? addresses.EscrowL1 : undefined;

	const [contractEscrowL1, setContractEscrow] = useState(undefined);

	useEffect(() => {
		getContract(provider, address, abis.EscrowL1, setContractEscrow, 'ESCROWL1');
	}, [provider, addresses]);

	return { contractEscrowL1 };
};

// export const useEscrowL1Account = () => {
// 	const { data } = useGQLQueryL1('account_escrow_l1', GET_ESCROWL1_ACCOUNT, { id: Addresses.EscrowL1.toLowerCase() }, { refetchOnMount: true });
// 	const [accountEscrowL1, setAccount] = useState(null);

// 	useEffect(() => {
// 		if (data && data.account !== null) {
// 			setAccount(data.account);
// 		}
// 	}, [data]);

// 	return {
// 		accountEscrowL1,
// 	};
// };
