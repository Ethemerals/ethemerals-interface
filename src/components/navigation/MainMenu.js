import { NavLink } from 'react-router-dom';

const MenuItem = ({ to, text }) => (
	<span className="px-4 text-gray-500 hover:text-gray-200">
		<NavLink exact to={to} activeClassName="menu-active">
			<span className="cursor-pointer py-2">{text}</span>
		</NavLink>
	</span>
);

const Mainmenu = () => {
	return (
		<div className="flex p-2 items-center ml-4 h-11 bg-gray-900 rounded-lg shadow-lg font-bold">
			<MenuItem to="/" text="Mint" />
			<MenuItem to="/ethemerals" text="Ethemerals" />
			<MenuItem to="/battle" text="Battle" />
			<MenuItem to="/marketplace" text="Marketplace" />
			{/* <MenuItem to="/art" text="Art" /> */}
		</div>
	);
};

export default Mainmenu;
