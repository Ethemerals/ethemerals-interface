import { useEffect, useState } from 'react';
import { getMeralImages } from '../../hooks/useMerals';
import { useMeralsUtils } from '../../hooks/useMeralsUtils';
import { useUser, useUserAccount } from '../../hooks/useUser';

const Spinner = () => (
	<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
);

const Thumbnail = ({ nft }) => {
	const { elements } = useMeralsUtils();
	return (
		<span style={{ backgroundColor: elements[nft.element].color }} className="flex w-10 h-10 rounded mr-2 relative cursor-pointer opacity-100">
			<div className="absolute top-0 left-0">
				<img className="w-10 h-10 z-0 rounded object-cover object-top" src={getMeralImages(nft.cmId).preview} alt="" />
			</div>
			<div className="flex-grow h-full"></div>
		</span>
	);
};

const MainIcon = () => {
	const { userMerals, mainIndex } = useUserAccount();
	const { isAuthenticating, isUserUpdating } = useUser();
	const [nft, setNft] = useState(undefined);

	useEffect(() => {
		if (userMerals && mainIndex !== undefined && userMerals.length > 0) {
			setNft(userMerals[mainIndex]);
		}
	}, [userMerals, mainIndex]);

	if (isAuthenticating || isUserUpdating) {
		return (
			<span className="flex bg-brandColor rounded items-center h-10 mr-2 cursor-pointer text-xs sm:text-base">
				<span className="text-white px-2 md:px-3">LOADING</span>
				<Spinner />
			</span>
		);
	}
	if (!nft) {
		return null;
	}
	return <Thumbnail nft={nft} />;
};

export default MainIcon;
