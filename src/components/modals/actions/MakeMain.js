import useUserAccount from '../../../hooks/useUserAccount';

const MakeMain = ({ id }) => {
	const { account, mutateUser, mainIndex, userNFTs } = useUserAccount();

	const selectMain = (id) => {
		if (account) {
			mutateUser.mutate({ address: account.id, main: id });
		}
	};

	if (!account) {
		return null;
	}

	return (
		<>
			{userNFTs[mainIndex].id === id ? (
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
