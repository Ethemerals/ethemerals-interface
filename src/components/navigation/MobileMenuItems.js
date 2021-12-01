import { Link } from 'react-router-dom';

const MenuItem = ({ to, text }) => (
	<span className="block py-4 border-b border-gray-400">
		<Link exact="true" to={to}>
			{text}
		</Link>
	</span>
);

const MobileNavItems = ({ toggle }) => {
	return (
		<div className="fixed left-0 top-0 w-screen h-screen">
			<div onClick={toggle} className="w-3/4 justify-center rounded-lg text-gray-900 text-center bg-opacity-100 py-4 mx-auto border-4 border-gray-400 bg-white font-medium mt-16">
				<span className="block pt-0 pb-4 border-b border-gray-400">
					<Link exact="true" to="/">
						Mint
					</Link>
				</span>
				<MenuItem to="/ethemerals" text="Ethemerals" />
				<MenuItem to="/art" text="Art Hunt" />
				{/* <MenuItem to="/battle/eternal" text="Battle" /> */}
				<span className="block pt-4 pb-0 border-gray-400">
					<Link exact="true" to="/battle">
						Battle
					</Link>
				</span>
			</div>
		</div>
	);
};

export default MobileNavItems;
