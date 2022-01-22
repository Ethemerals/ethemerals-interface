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
		<div className="flex px-2 items-center h-10 bg-white rounded-lg text-lg">
			<MenuItem to="/mint" text="Mint" />
			<MenuItem to="/ethemerals" text="Ethemerals" />
			<MenuItem to="/art" text="Art Hunt" />
			{/* {process.env.REACT_APP_NETWORK === '4' && <MenuItem to="/portal" text="Portal" />} */}
			{process.env.REACT_APP_NETWORK === '4' && <MenuItem to="/wilds" text="The Wilds" />}
			{/* <MenuItem to="/battle" text="Market Battle" /> */}
		</div>
	);
};

export default Mainmenu;
