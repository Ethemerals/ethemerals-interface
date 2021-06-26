import { useState, useEffect } from 'react';

import useUserState from '../../../hooks/useUserState';

const NFTMakeMain = ({ account, id }) => {
	const { mainID, mainIndex, mutateUser, isLoading, userNFTs } = useUserState(account);

	const selectMain = (id) => {
		if (account) {
			mutateUser.mutate({ address: account.id, main: id });
		}
	};

	return (
		<>
			<button onClick={() => selectMain(id)} className="bg-gray-700 p-4">
				Make Main
			</button>
		</>
	);
};

export default NFTMakeMain;
