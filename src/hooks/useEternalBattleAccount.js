import React, { useEffect, useState } from 'react';

import { useQuery, useMutation, useQueryClient } from 'react-query';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_ETERNALBATTLE_ACCOUNT } from '../queries/Subgraph';

import Addresses from '../constants/contracts/Addresses';

const useEternalBattleAccount = () => {
	const queryClient = useQueryClient();

	const { data, status, loaded } = useGQLQuery('account_eternalBattle', GET_ETERNALBATTLE_ACCOUNT, { id: Addresses.EternalBattle.toLowerCase() });

	const [accountEternalBattle, setAccountEternalBattle] = useState(null);

	useEffect(() => {
		if (data && data.account !== null) {
			setAccountEternalBattle(data.account);
		}
	}, [data]);

	return {
		accountEternalBattle,
	};
};

export default useEternalBattleAccount;
