import React, { useEffect, useState } from 'react';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_ACCOUNT } from '../queries/Subgraph';
import { useAddress, useBalance } from '../hooks/Web3Context';
import { isAddress } from '../utils';

const useUserAccount = () => {
	const address = useAddress();
	const balance = useBalance();

	const { data, status, loaded, error } = useGQLQuery('account', GET_ACCOUNT, { id: address });

	const [account, setAccount] = useState(null);

	useEffect(() => {
		if (data && data.account !== null) {
			setAccount(data.account);
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			console.log(error);
		}
	}, [error]);

	return { account, loaded, status, address, balance };
};

export default useUserAccount;
