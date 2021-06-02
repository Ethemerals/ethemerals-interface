import { Link } from 'react-router-dom';
import Links from '../../constants/Links';

// <MenuItem to="/" text="Mint" />
// <MenuItem to="/ethemerals" text="Ethemerals" />
// <MenuItem to="/battle" text="Battle" />
// <MenuItem to="/marketplace" text="Marketplace" />
// <MenuItem to="/art" text="Art" />

const MenuItem = ({ to, text }) => (
	<span className="block py-4 border-b border-gray-800">
		<Link exact="true" to={to}>
			{text}
		</Link>
	</span>
);

const MobileNavItems = ({ toggle }) => {
	return (
		<>
			<div
				onClick={toggle}
				className="fixed w-3/4 justify-center rounded-2xl text-gray-300 text-center shadow-2xl bg-opacity-100 py-4 mx-auto border-4 border-gray-800 bg-brandColor-black font-medium"
			>
				<span className="block pt-0 pb-4 border-b border-gray-800">
					<Link exact="true" to="/">
						Mint
					</Link>
				</span>
				<MenuItem to="/ethemerals" text="Ethemerals" />
				<MenuItem to="/battle" text="Battle" />
				<MenuItem to="/marketplace" text="Marketplace" />
				<span className="block pt-4 pb-0 border-gray-800">
					<Link exact="true" to="/art">
						Art
					</Link>
				</span>
			</div>
		</>
	);
};

export default MobileNavItems;
