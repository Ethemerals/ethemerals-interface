import { useState, useEffect } from 'react';

import useUserState from '../../../hooks/useUserState';
import useUserAccount from '../../../hooks/useUserAccount';

const MakeMain = ({ address, id }) => {
	const { account } = useUserAccount();
	const { mainID, mainIndex, mutateUser, isLoading, userNFTs } = useUserState(address);

	const selectMain = (id) => {
		if (account) {
			mutateUser.mutate({ address: account.id, main: id });
		}
	};

	return (
		<>
			{mainID === id ? (
				<div className="bg-gray-700 p-4">Current Main</div>
			) : (
				<button onClick={() => selectMain(id)} className="bg-gray-700 p-4">
					Make Main
				</button>
			)}
		</>
	);
};

export default MakeMain;
