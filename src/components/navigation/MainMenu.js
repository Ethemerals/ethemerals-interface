import { NavLink } from 'react-router-dom';

const MenuItem = ({ to, text }) => (
	<span className="px-2 text-gray-400 hover:text-gray-300">
		<NavLink exact to={to} activeClassName="menu-active">
			<span className="cursor-pointer py-2">{text}</span>
		</NavLink>
	</span>
);

const Mainmenu = () => {
	return (
		<div className="mx-5">
			<MenuItem to="/" text="Mint" />
			<MenuItem to="/ethemerals" text="Ethemerals" />
			<MenuItem to="/battle" text="Battle" />
			<MenuItem to="/marketplace" text="Marketplace" />
			<MenuItem to="/art" text="Art" />
		</div>
	);
};

export default Mainmenu;
