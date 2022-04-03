import { NavLink } from 'react-router-dom';

const MenuItem = ({ to, text }) => (
	<span className="px-4 text-gray-600 hover:text-yellow-400">
		<NavLink to={to} activeClassName="menu-active">
			<span className="cursor-pointer py-2">{text}</span>
		</NavLink>
	</span>
);

const Mainmenu = () => {
	return (
		<div className="flex px-2 items-center">
			<MenuItem to="/mint" text="Mint" />
			<MenuItem to="/ethemerals" text="Ethemerals" />
			<MenuItem to="/art" text="Art" />
			<MenuItem to="/register" text="Portal" />
			<MenuItem to="/battle/poly" text="Eternal Battle" />
		</div>
	);
};

export default Mainmenu;
