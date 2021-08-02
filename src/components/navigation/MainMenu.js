import { NavLink } from 'react-router-dom';

const MenuItem = ({ to, text }) => (
	<span className="px-4 text-gray-400 hover:text-gray-200">
		<NavLink exact to={to} activeClassName="menu-active">
			<span className="cursor-pointer py-2">{text}</span>
		</NavLink>
	</span>
);

const Mainmenu = () => {
	return (
		<div className="flex p-4 items-center ml-4 h-9 bg-gray-800 rounded-lg shadow-lg font-bold">
			<MenuItem to="/" text="Mint" />
			<MenuItem to="/ethemerals/2" text="Ethemerals" />
			<MenuItem to="/battle" text="Battle" />
			<MenuItem to="/marketplace" text="Marketplace" />
			{/* <MenuItem to="/art" text="Art" /> */}
		</div>
	);
};

export default Mainmenu;
