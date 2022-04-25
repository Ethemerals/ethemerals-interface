import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Images from '../../constants/Images';
import { useIsWildsContext, useIsWildsHomeContext } from '../../context/MenuContext';

const MenuItem = ({ to, text }) => {
	const [isActive, setIsActive] = useState(false);
	const location = useLocation();
	const history = useHistory();

	const handleOnSubmit = () => {
		history.push(to);
	};

	useEffect(() => {
		if (location.pathname.includes(to)) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [location, to]);

	return (
		<div onClick={handleOnSubmit} className={`${isActive ? 'text-brandColor' : 'text-gray-800 hover:text-brandColor-pale'} whitespace-nowrap px-4`}>
			<span className="cursor-pointer py-2">{text}</span>
		</div>
	);
};

const NonWildsMenu = () => {
	const history = useHistory();
	const handleEnterWilds = () => {
		history.push('/wilds');
	};

	return (
		<div className="absolute flex items-center">
			<div className="w-10"></div>
			<MenuItem to="/mint" text="Mint" isWilds={false} />
			<MenuItem to="/ethemerals" text="Ethemerals" isWilds={false} />
			<MenuItem to="/art" text="Art" isWilds={false} />
			<div onClick={handleEnterWilds} className="text-gray-600 hover:text-white hover:bg-brandColor whitespace-nowrap px-2 py-1 ml-3 rounded-md border border-gray-200 transition 600">
				<span className="cursor-pointer py-2">Enter The Wilds</span>
			</div>
		</div>
	);
};

const WildsMenu = () => {
	return (
		<div className="absolute flex items-center">
			<div className="w-10"></div>
			<MenuItem to="/wilds" text="The Wilds" />
			<MenuItem to="/register" text="Gateway" />
			<MenuItem to="/battle/poly" text="Eternal Battle" />
		</div>
	);
};

const Mainmenu = () => {
	const history = useHistory();
	const isWildsHome = useIsWildsHomeContext();
	const isWilds = useIsWildsContext();

	return (
		<div className="flex items-center">
			{!isWilds && <NonWildsMenu />}
			{isWilds && !isWildsHome && <WildsMenu />}
			<div onClick={() => history.push('/')} className="cursor-pointer absolute px-4 py-2">
				<img src={isWildsHome ? Images.iconDrain : Images.ELFLogo} alt="" width="24" height="24" />
			</div>
		</div>
	);
};

export default Mainmenu;
