import { useHistory } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const MenuItem = ({ to, text }) => (
	<span className="px-4 text-gray-600 hover:text-yellow-400">
		<NavLink to={to} activeClassName="menu-active">
			<span className="cursor-pointer py-2">{text}</span>
		</NavLink>
	</span>
);

const EnterTheWilds = () => {
	const history = useHistory();

	const toggle = () => {
		history.push(`/wilds`);
	};

	return (
		<button
			style={{ backgroundColor: 'rgba(251, 225, 255)' }}
			className="px-7 h-10 mx-4 border border-brandColor-dark hover:border-brandColor-purple shadow-sm focus:outline-none flex items-center justify-center text-brandColor-dark hover:text-brandColor-purple rounded transition duration-300"
			onClick={toggle}
		>
			The Wilds
		</button>
	);
};

const Mainmenu = () => {
	return (
		<div className="flex px-2 items-center">
			<MenuItem to="/mint" text="Mint" />
			<MenuItem to="/ethemerals" text="Ethemerals" />
			<MenuItem to="/art" text="Art" />
			{/* <MenuItem to="/register" text="Portal" /> */}
			{/* <MenuItem to="/battle/poly" text="Eternal Battle" /> */}
			<EnterTheWilds />
		</div>
	);
};

export default Mainmenu;
