import { isAddress } from '../../utils';
import useUserAccount from '../../hooks/useUserAccount';

const Spinner = () => (
	<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
);

const NFTPreview = () => {
	const { mainID, mutateUser, userIsLoading, userNFTs, address } = useUserAccount();

	if (!isAddress(address)) {
		return (
			<span className="flex bg-brandColor-purple rounded-xl items-center h-8 md:h-11 mr-2 cursor-pointer text-xs sm:text-base hover:bg-brandColor transition duration-300">
				<span className="text-white px-2 md:px-3">NO NFTS</span>
			</span>
		);
	}

	if (userIsLoading || mutateUser.isLoading) {
		return (
			<span className="flex bg-brandColor-purple rounded-xl items-center h-8 md:h-11 mr-2 cursor-pointer text-xs sm:text-base hover:bg-brandColor transition duration-300">
				<span className="text-white px-2 md:px-3">LOADING</span>
				<Spinner />
			</span>
		);
	}

	return (
		<span className="flex bg-brandColor-purple rounded-xl items-center h-8 md:h-11 mr-2 cursor-pointer text-xs sm:text-base hover:bg-brandColor transition duration-300">
			{address && userNFTs.length > 0 && mainID ? (
				<span className="text-white px-2 md:px-3">
					#{mainID} of {userNFTs.length}
				</span>
			) : (
				<span className="text-white px-2 md:px-3">NO NFTS</span>
			)}
		</span>
	);
};

export default NFTPreview;
