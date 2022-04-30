import { useEffect, useState } from 'react';
import Moralis from 'moralis';
import { useQuery } from 'react-query';
import { useUserAccount } from './useUser';

const getUserFaucet = async (address) => {
	const userFaucet = Moralis.Object.extend('Faucet');
	const query = new Moralis.Query(userFaucet);
	query.equalTo('address', address.toLowerCase());
	const result = await query.first();
	return result;
};

export const useGetFaucet = () => {
	const { address } = useUserAccount();
	const [userFaucet, setUserFaucet] = useState(undefined);
	const { isLoading, data } = useQuery(`faucet_${address}`, () => getUserFaucet(address), { enabled: !!address, refetchInterval: 10000 });

	useEffect(() => {
		if (data && !isLoading) {
			let faucet = {
				address: data.get('address'),
				sent: data.get('sent'),
				denied: data.get('denied'),
				requested: data.get('requested'),
			};
			setUserFaucet(faucet);
		}
	}, [data, isLoading]);

	return { userFaucet };
};
