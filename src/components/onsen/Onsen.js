import AvailableToRegister from './cards/AvailableToRegister';
import PendingValidation from './cards/PendingValidation';
import MintedProxyMerals from './cards/MintedProxyMerals';
import { useEffect } from 'react';

const Onsen = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const styleBG = {
		backgroundColor: 'black',
		backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/webapp/onsen_bg.jpg'",
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

	return (
		<>
			<div style={styleBG}></div>
			<div style={{ minWidth: '900px', maxWidth: '900px' }} className="pt-20 mb-64 mx-auto text-black">
				{/* HEADER */}
				<div className="text-black w-full">
					<h2 className="mt-2 pb-2 text-4xl text-white p-4">ONSEN</h2>
					<div className="flex items-stretch space-x-4">
						<div style={styleBoxshadow} className="bg-white w-2/3 p-4 rounded-md py-6">
							<p className="text-sm text-gray-700">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec lectus in diam sollicitudin porta. Quisque quam elit, mattis vel ligula a, ultrices tristique sem. Integer tincidunt
								purus nulla, vitae fermentum dui lobortis id. Nullam id purus id ex convallis ultrices eu a nisi. Vivamus egestas arcu id metus posuere aliquet. Cras vestibulum odio eu sollicitudin
								porttitor. Nulla convallis at est non lacinia. Ut nec mollis est, id tempus felis.
							</p>
						</div>
						<div className="w-1/3 rounded-md relative overflow-hidden bg-blue-200 text-center p-4">SOME TEXT HERE</div>
					</div>
				</div>

				<AvailableToRegister />
				<PendingValidation />
				<MintedProxyMerals />
			</div>
		</>
	);
};

export default Onsen;
