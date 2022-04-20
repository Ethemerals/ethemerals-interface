import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const WildsWorldAlpha = () => {
	const history = useHistory();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const styleBG = {
		backgroundColor: 'black',
		backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/webapp/bg_title.webp'",
		backgroundRepeat: 'no-repeat',
		backgroundAttachment: 'fixed',
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		position: 'fixed',
		width: '100vw',
		height: '100vh',
		zIndex: '-1',
	};

	return (
		<>
			<div style={styleBG}></div>
			<div className="relative">
				<p className="text-white opacity-60 pt-16 pl-4 absolute">MAINNET BETA</p>
				<div style={{ minWidth: '900px', maxWidth: '900px' }} className="pt-20 mb-64 mx-auto text-black">
					{/* HEADER */}
					<div className="text-black w-full">
						<h2 className="text-4xl text-white px-4 mt-32">THE WILDS</h2>
						<p className="py-2 text-base text-white px-4">
							The Wilds is a place for the brave and reckless to play and compete together. A collection of smart contracts deployed on the Polygon network. All NFT projects are welcome to use the
							gateway!
						</p>
						<div className="flex space-x-4 mt-16">
							<div onClick={() => history.push(`/register`)} className="bg-white w-1/3 rounded-md p-4 h-48 border-white border-2 bg-opacity-70 cursor-pointer hover:bg-opacity-100">
								<h2 className="mb-20">VIRTUAL GATEWAY</h2>
								<p className="text-sm">Send your NFTs through the virtual gateway</p>
							</div>
							<div onClick={() => history.push(`/battle/poly`)} className="bg-white w-1/3 rounded-md p-4 h-48 border-white border-2 bg-opacity-70 cursor-pointer hover:bg-opacity-100">
								<h2 className="mb-20">ETERNAL BATTLE</h2>
								<p className="text-sm">Stake your Merals against crypto markets, earn rewards and items</p>
							</div>
							<div className="bg-white w-1/3 rounded-md p-4 h-48 border-white border-2 opacity-20">
								<h2 className="mb-20">ONSEN</h2>
								<p className="text-sm">Heal and relax ...</p>
								<p className="text-sm">under construction</p>
							</div>
						</div>
						<div className="flex space-x-4 my-8">
							<div className="bg-white w-1/3 rounded-md p-4 h-48 border-white border-2 opacity-20">
								<h2 className="mb-20">THE WILD LANDS</h2>
								<p className="text-sm">Claim and Conquer...</p>
								<p className="text-sm">under construction</p>
							</div>
							<div className="w-1/3 rounded-md p-4 h-48"></div>
							<div className="w-1/3 rounded-md p-4 h-48"></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default WildsWorldAlpha;
