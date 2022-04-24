import { useHistory } from 'react-router-dom';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTransition, animated, config } from '@react-spring/web';
import Images from '../../constants/Images';

const MenuItem = ({ to, text, setIsWilds, isWilds }) => {
	const [isActive, setIsActive] = useState(false);
	const location = useLocation();
	const history = useHistory();

	const handleOnSubmit = () => {
		history.push(to);
		setIsWilds(isWilds);
	};

	useEffect(() => {
		if (location.pathname.includes(to)) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [location, to]);

	return (
		<div onClick={handleOnSubmit} className={`${isActive ? 'text-brandColor' : 'text-gray-600 hover:text-yellow-400'} whitespace-nowrap px-4`}>
			<span className="cursor-pointer py-2">{text}</span>
		</div>
	);
};

const NonWildsMenu = ({ show, setIsWilds }) => {
	const history = useHistory();
	const handleEnterWilds = () => {
		history.push('/wilds');
	};
	const transitions = useTransition(show, {
		from: { opacity: 0, transform: 'translate(-250px,0)' },
		enter: { opacity: 1, transform: 'translate(0,0)' },
		leave: { opacity: 0, transform: 'translate(-250px,0)' },
	});

	return transitions(
		(styles, item) =>
			item && (
				<animated.div style={{ ...styles }} className="absolute flex items-center">
					<div className="w-10"></div>
					<MenuItem to="/mint" text="Mint" setIsWilds={setIsWilds} isWilds={false} />
					<MenuItem to="/ethemerals" text="Ethemerals" setIsWilds={setIsWilds} isWilds={false} />
					<MenuItem to="/art" text="Art" setIsWilds={setIsWilds} isWilds={false} />
					<div onClick={handleEnterWilds} className="text-gray-600 hover:text-white hover:bg-brandColor whitespace-nowrap px-2 py-1 ml-3 rounded-md border border-gray-200 transition 600">
						<span className="cursor-pointer py-2">Enter The Wilds</span>
					</div>
				</animated.div>
			)
	);
};

const WildsMenu = ({ show, setIsWilds }) => {
	const transitions = useTransition(show, {
		from: { opacity: 0, transform: 'translate(250px,0)' },
		enter: { opacity: 1, transform: 'translate(0,0)' },
		leave: { opacity: 0, transform: 'translate(250px,0)' },
	});
	return transitions(
		(styles, item) =>
			item && (
				<animated.div style={{ ...styles }} className="absolute flex items-center">
					<div className="w-10"></div>
					<MenuItem to="/wilds" text="The Wilds" setIsWilds={setIsWilds} isWilds={true} />
					<MenuItem to="/register" text="Gateway" setIsWilds={setIsWilds} isWilds={true} />
					<MenuItem to="/battle/poly" text="Eternal Battle" setIsWilds={setIsWilds} isWilds={true} />
				</animated.div>
			)
	);
};

const Mainmenu = () => {
	const history = useHistory();
	const location = useLocation();
	const [isWilds, setIsWilds] = useState(false);

	const handleSubmitHome = () => {
		history.push('/');
		setIsWilds(false);
	};

	useEffect(() => {
		if (location.pathname.includes('wilds') || location.pathname.includes('register') || location.pathname.includes('battle') || location.pathname.includes('onsen')) {
			setIsWilds(true);
		}
	}, [location]);

	return (
		<div className="flex items-center">
			<NonWildsMenu show={!isWilds} setIsWilds={setIsWilds} />
			<WildsMenu show={isWilds} setIsWilds={setIsWilds} />
			<div onClick={handleSubmitHome} className="cursor-pointer absolute bg-white px-4 py-2">
				<img src={Images.ELFLogo} alt="" width="24" height="24" />
			</div>
		</div>
	);
};

export default Mainmenu;
