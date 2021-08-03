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
		<>
			<div onClick={toggle} className="fixed w-3/4 justify-center rounded-lg text-gray-900 text-center bg-opacity-100 py-4 mx-auto border-4 border-gray-400 bg-white font-medium">
				<span className="block pt-0 pb-4 border-b border-gray-400">
					<Link exact="true" to="/">
						Mint
					</Link>
				</span>
				<MenuItem to="/ethemerals/2" text="Ethemerals" />
				<MenuItem to="/battle/eternal" text="Battle" />
				<span className="block pt-4 pb-0 border-gray-400">
					<Link exact="true" to="/marketplace">
						Marketplace
					</Link>
				</span>
			</div>
		</>
	);
};

export default MobileNavItems;
