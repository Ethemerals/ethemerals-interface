import { useEffect, useState } from 'react';

import useLocalUser from '../../hooks/useLocalUser';

const NFTPreview = ({ data }) => {
	const [localUser, updateLocalUser] = useLocalUser();
	const [account, setAccount] = useState(false);
	const [mainID, setMainID] = useState(undefined);

	useEffect(() => {
		if (data) {
			setAccount(data.account);
		}
	}, [data]);

	useEffect(() => {
		if (account) {
			setLocalUser();
		}
	}, [account]);

	useEffect(() => {
		if (localUser) {
			setLocalUser();
		}
	}, [localUser]);

	const setLocalUser = () => {
		if (localUser[account.id] !== undefined && localUser[account.id].active) {
			console.log(`welcome ${account.id}`);
			setMainID(localUser[account.id].main);
		} else {
			// NO LOCALUSER BUT HAS ACCOUNT
			const _mainNFT = account.ethemerals.length === 0 ? undefined : account.ethemerals[0].id;
			updateLocalUser({
				[account.id]: {
					active: true,
					main: _mainNFT,
				},
			});
			setMainID(_mainNFT);
		}
	};

	if (!account) {
		// NEW USER
		return (
			<span className="flex bg-brandColor-purple rounded-xl items-center h-8 md:h-11 mr-2 cursor-pointer text-xs sm:text-base hover:bg-brandColor transition duration-300">
				<span className="text-white px-2 md:px-3">NO NFTS</span>
			</span>
		);
	}

	return (
		<span className="flex bg-brandColor-purple rounded-xl items-center h-8 md:h-11 mr-2 cursor-pointer text-xs sm:text-base hover:bg-brandColor transition duration-300">
			{/* // USER, NO NFTS */}
			{account.ethemerals.length === 0 && <span className="text-white px-2 md:px-3">NO NFTS</span>}
			{account.ethemerals.length > 0 && mainID && <span className="text-white px-2 md:px-3">#{mainID} NFTS</span>}
		</span>
	);
};

export default NFTPreview;
