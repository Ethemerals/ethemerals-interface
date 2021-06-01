import { NavLink } from 'react-router-dom';

const MenuItem = ({ to, text }) => (
	<span className="px-3 text-gray-400 hover:text-gray-300">
		<NavLink exact to={to} activeClassName="menu-active">
			<span className="cursor-pointer py-2 lg:py-4">{text}</span>
		</NavLink>
	</span>
);

const Mainmenu = () => {
	return (
		<div className="sm:mr-5 sm:ml-0 lg:ml-5 lg:mr-0">
			<MenuItem to="/" text="Mint" />
			<MenuItem to="/ethemerals" text="Ethemerals" />
			<MenuItem to="/battle" text="Battle" />
			<MenuItem to="/marketplace" text="Marketplace" />
			<MenuItem to="/art" text="Art" />
		</div>
	);
};

export default Mainmenu;
