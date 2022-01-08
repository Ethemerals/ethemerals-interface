import { useNFTUtils } from '../../hooks/useNFTUtils';
import { useUser, useUserAccount } from '../../hooks/useUser';

const Spinner = () => (
	<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
);

const NFTPreview = () => {
	const { account, userNFTs, mainIndex } = useUserAccount();
	const { isAuthenticating, user } = useUser();

	const { getNFTImages } = useNFTUtils();

	if (userNFTs.length > 0 && (isAuthenticating || !user)) {
		return (
			<span className="flex bg-brandColor rounded-lg items-center h-10 mr-2 cursor-pointer text-xs sm:text-base">
				<span className="text-white px-2 md:px-3">LOADING</span>
				<Spinner />
			</span>
		);
	}

	return (
		<>
			{account && userNFTs.length > 0 ? (
				<span className="flex w-10 h-10 rounded-lg mr-2 relative cursor-pointer opacity-100 bg-brandColor-purple">
					<div className="absolute top-0 left-0">
						{mainIndex !== undefined && <img className="w-10 h-10 z-0 rounded-lg" src={getNFTImages(userNFTs[mainIndex].metadata.id).colors[0].thumbnail} alt="" />}
					</div>
					<div className="flex-grow h-full"></div>
					<div className="absolute bottom-0 left-0 rounded-t-none rounded-lg text-xs font-bold w-full text-gray-200 text-center bg-black bg-opacity-60">
						{mainIndex !== undefined && userNFTs[mainIndex].id.toString().padStart(4, '0')}
					</div>
				</span>
			) : (
				<span className="flex w-10 h-10 bg-brandColor rounded-lg mr-2 items-baseline relative cursor-pointer opacity-70">
					<span className="flex-grow h-full"></span>
					<span className="rounded-t-none rounded-lg text-xs font-bold w-full h-3 text-gray-100 text-right bg-black bg-opacity-50"></span>
				</span>
			)}
		</>
	);
};

export default NFTPreview;
