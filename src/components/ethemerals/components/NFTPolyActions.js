import { useHistory } from 'react-router-dom';
import { useState } from 'react';

import Images from '../../../constants/Images';
import { refreshMetadata } from '../../../hooks/useOpensea';

const NFTPolyActions = ({ nft }) => {
	const [savingMetadata, setMetadataSaving] = useState(false);
	const history = useHistory();

	const handleOnClick = () => {
		history.push(`/register`);
	};

	const handleForceUpdate = async () => {
		console.log('.');
		setMetadataSaving(true);
		await refreshMetadata(nft.tokenId);
		setMetadataSaving(false);
	};

	if (!nft) {
		return null;
	}

	return (
		<div className="grid grid-cols-1 gap-2 px-2 text-sm text-white">
			<button onClick={handleOnClick} className={`flex items-center rounded-lg bg-blue-400 cursor-pointer hover:bg-blue-300 transition duration-200`}>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="19px" height="19px" alt="icon wing" src={Images.iconAvatar} />
				</div>
				<p>Virtual Gateway</p>
			</button>
			{nft.type === '1' && (
				<button
					onClick={handleForceUpdate}
					disabled={savingMetadata}
					className={`flex items-center rounded-lg ${savingMetadata ? '' : 'cursor-pointer'} bg-white hover:text-blue-800 transition duration-200 text-black`}
				>
					<div style={{ paddingTop: '2px', marginLeft: '2px' }} className="w-8 h-8 relative">
						<svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50C100 77.6 77.6 100 50 100C22.4 100 0 77.6 0 50C0 22.4 22.4 0 50 0C77.6 0 100 22.4 100 50Z" fill="white" />
							<path
								d="M24.6999 51.7L24.8999 51.4L37.8999 31.1C38.0999 30.8 38.4999 30.8 38.6999 31.2C40.8999 36.1 42.6999 42.1 41.8999 45.9C41.4999 47.5 40.4999 49.6 39.2999 51.5C39.1999 51.8 38.9999 52.1 38.7999 52.3C38.6999 52.4 38.5999 52.5 38.3999 52.5H24.9999C24.6999 52.4 24.4999 52 24.6999 51.7Z"
								fill="#2081E2"
							/>
							<path
								d="M82.5999 55.5V58.7C82.5999 58.9 82.4999 59 82.2999 59.1C81.2999 59.5 77.7999 61.1 76.3999 63.1C72.6999 68.2 69.8999 75.5 63.6999 75.5H37.5999C28.3999 75.5 20.8999 68 20.8999 58.7V58.4C20.8999 58.2 21.0999 58 21.2999 58H35.9999C36.2999 58 36.4999 58.3 36.4999 58.5C36.3999 59.4 36.5999 60.4 36.9999 61.3C37.8999 63.1 39.6999 64.1 41.5999 64.1H48.7999V58.5H41.6999C41.2999 58.5 41.0999 58.1 41.2999 57.8C41.3999 57.7 41.4999 57.6 41.5999 57.4C42.2999 56.4 43.1999 55 44.1999 53.3C44.8999 52.2 45.4999 50.9 45.9999 49.7C46.0999 49.5 46.1999 49.3 46.2999 49C46.3999 48.6 46.5999 48.2 46.6999 47.9C46.7999 47.6 46.8999 47.3 46.9999 47C47.1999 46 47.2999 44.9 47.2999 43.7C47.2999 43.3 47.2999 42.8 47.1999 42.3C47.1999 41.8 47.0999 41.3 47.0999 40.8C47.0999 40.4 46.9999 39.9 46.8999 39.5C46.7999 38.8 46.6999 38.2 46.4999 37.5L46.3999 37.3C46.2999 36.9 46.1999 36.4 45.9999 36C45.5999 34.6 45.0999 33.2 44.5999 32C44.3999 31.5 44.1999 31 43.9999 30.5C43.6999 29.8 43.3999 29.1 43.0999 28.5C42.9999 28.2 42.7999 28 42.6999 27.7C42.5999 27.4 42.3999 27.1 42.2999 26.8C42.1999 26.6 42.0999 26.4 41.9999 26.2L41.0999 24.6C40.9999 24.4 41.1999 24.1 41.3999 24.2L46.8999 25.7L47.5999 25.9L48.3999 26.1L48.6999 26.2V22.9C48.6999 21.3 49.9999 20 51.4999 20C52.2999 20 52.9999 20.3 53.4999 20.8C53.9999 21.3 54.2999 22 54.2999 22.8V27.6L54.8999 27.8C54.8999 27.8 54.9999 27.8 54.9999 27.9C55.0999 28 55.2999 28.2 55.5999 28.4C55.7999 28.6 55.9999 28.8 56.2999 29C56.7999 29.4 57.4999 30 58.1999 30.6C58.3999 30.8 58.5999 30.9 58.6999 31.1C59.5999 31.9 60.5999 32.9 61.5999 34C61.8999 34.3 62.0999 34.6 62.3999 34.9C62.6999 35.2 62.8999 35.6 63.1999 35.9C63.4999 36.3 63.8999 36.8 64.1999 37.2C64.2999 37.4 64.4999 37.6 64.5999 37.9C64.9999 38.5 65.2999 39.1 65.6999 39.7C65.7999 40 65.9999 40.3 66.0999 40.6C66.4999 41.4 66.7999 42.2 66.8999 43.1C66.9999 43.3 66.9999 43.5 66.9999 43.6C67.0999 43.8 67.0999 44.1 67.0999 44.4C67.1999 45.3 67.0999 46.1 66.9999 47C66.8999 47.4 66.7999 47.7 66.6999 48.1C66.5999 48.4 66.4999 48.8 66.2999 49.2C65.9999 49.9 65.5999 50.6 65.1999 51.3C65.0999 51.5 64.8999 51.8 64.6999 52.1C64.4999 52.4 64.2999 52.6 64.1999 52.9C63.9999 53.2 63.6999 53.5 63.4999 53.8C63.2999 54.1 63.0999 54.4 62.7999 54.7C62.4999 55.1 62.0999 55.5 61.7999 55.9C61.5999 56.1 61.3999 56.4 61.0999 56.6C60.8999 56.8 60.6999 57.1 60.3999 57.3C60.0999 57.6 59.7999 57.9 59.4999 58.1L58.8999 58.6C58.7999 58.7 58.6999 58.7 58.5999 58.7H54.1999V64.3H59.6999C60.8999 64.3 62.0999 63.9 62.9999 63.1C63.2999 62.8 64.6999 61.6 66.3999 59.8C66.4999 59.7 66.4999 59.7 66.5999 59.7L81.7999 55.3C82.3999 55 82.5999 55.2 82.5999 55.5Z"
								fill="#2081E2"
							/>
						</svg>
					</div>
					<p>{savingMetadata ? 'Updating...' : 'Update Opensea Image'}</p>
				</button>
			)}
		</div>
	);
};

export default NFTPolyActions;
