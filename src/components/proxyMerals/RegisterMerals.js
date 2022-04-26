import AvailableToRegister from './cards/AvailableToRegister';
import PendingValidation from './cards/PendingValidation';
import { useEffect } from 'react';
import MintedVerifiedMerals from './cards/MintedVerifiedMerals';
import { availableCollectionsList } from '../../constants/Collections';
import { useParams } from 'react-router-dom';
import { Links } from '../../constants/Links';
import { Addresses } from '../../constants/contracts/Addresses';

const RegisterMerals = () => {
	let { id } = useParams();
	if (id === 0 || !id) {
		id = 1;
	}

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const styleBG = {
		backgroundColor: 'black',
		backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/webapp/portal_bg.jpg'",
		backgroundRepeat: 'no-repeat',
		backgroundAttachment: 'fixed',
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		position: 'fixed',
		width: '100vw',
		height: '100vh',
		zIndex: '-1',
	};

	const styleBoxshadow = {
		boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4)',
	};

	let txLink = `${Links.POLYSCAN_URL}address/${Addresses.MeralManager}`;

	return (
		<>
			<div style={styleBG}></div>
			<div style={{ minWidth: '900px', maxWidth: '900px' }} className="pt-20 mb-64 mx-auto text-black">
				{/* HEADER */}
				<div className="text-black w-full">
					<h2 className="mt-2 pb-2 text-4xl text-white p-4">VIRTUAL NFT GATEWAY</h2>
					<div className="flex items-stretch space-x-4">
						<div style={styleBoxshadow} className="bg-white w-2/3 p-4 rounded-md py-6">
							<p className="text-sm text-gray-700">
								The Gateway allows you to virtualize a NFT from any collection. A NFT on the Polygon blockchain is minted as a <strong>MERAL</strong> to be used with <strong>THE WILDS</strong>{' '}
								ecosystem of onchain games. Climb the leaderboards, earn rewards and prizes. For glory and honor!
							</p>
							<p className="text-sm text-gray-700 pt-4">
								The virtualized Meral is available to interact with as long as you own the original NFT. Virtualizing your original NFT does not require the NFT to be moved or any contract to be
								approved!
							</p>
							<p className="text-sm text-gray-700 pt-4">
								If you no longer own the orignal NFT, the Meral becomes dormant until the new owner activates it. The Meral stats and history will carry over.
							</p>
							<p className="text-sm text-blue-700 pt-4 cursor-pointer hover:text-blue-400">
								<a href={txLink} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-400">
									Verified Polygon Contract
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
										<polyline points="15 3 21 3 21 9"></polyline>
										<line x1="10" y1="14" x2="21" y2="3"></line>
									</svg>
								</a>
							</p>
							{/* <p className="text-sm text-gray-700 pt-4">Link to Gateway contract, Link to Help, link to Discord</p> */}
						</div>
						<div className="w-1/3 rounded-md relative overflow-hidden bg-blue-200 text-center p-4">
							<p>VALIDATOR STATUS</p>
							<p>MATIC FAUCET</p>
						</div>
					</div>
				</div>

				<AvailableToRegister collection={availableCollectionsList[id]} />
				<PendingValidation />
				<MintedVerifiedMerals />
			</div>
		</>
	);
};

export default RegisterMerals;
