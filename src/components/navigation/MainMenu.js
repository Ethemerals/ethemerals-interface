import { NavLink } from 'react-router-dom';

const MenuItem = ({ to, text }) => (
	<span className="px-4 text-gray-500 hover:text-yellow-400">
		<NavLink exact to={to} activeClassName="menu-active">
			<span className="cursor-pointer py-2">{text}</span>
		</NavLink>
	</span>
);

const Mainmenu = () => {
	return (
		<div className="flex p-4 items-center ml-4 h-10 bg-white rounded-lg font-bold">
			<MenuItem to="/" text="Mint" />
			<MenuItem to="/ethemerals/2" text="Ethemerals" />
			<MenuItem to="/battle/eternal" text="Battle" />
			<MenuItem to="/marketplace" text="Marketplace" />
		</div>
	);
};

export default Mainmenu;
