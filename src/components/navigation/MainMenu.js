import { NavLink } from 'react-router-dom';

const MenuItem = ({ to, text }) => (
	<span className="px-4 text-gray-600 hover:text-yellow-400">
		<NavLink to={to} activeClassName="menu-active">
			<span className="cursor-pointer py-2">{text}</span>
		</NavLink>
	</span>
);

const MenuItemDisabled = ({ text }) => (
	<span className="px-4 text-gray-600 hover:text-yellow-400">
		<span className="cursor-pointer py-2">{text}</span>
	</span>
);

const Mainmenu = () => {
	return (
		<div className="flex px-2 items-center ml-4 h-10 bg-white rounded-lg text-lg">
			<MenuItem to="/mint" text="Mint" />
			<MenuItem to="/ethemerals" text="Ethemerals" />
			<MenuItem to="/equipables" text="Equipables" />
			<MenuItemDisabled to="/battle" text="Battle" />
			{/* <MenuItemDisabled to="/marketplace" text="Marketplace" /> */}
		</div>
	);
};

export default Mainmenu;
