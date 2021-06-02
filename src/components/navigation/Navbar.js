import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTransition, useSpring, animated, config } from '@react-spring/web';

import MobileMenuItems from './MobileMenuItems';
import Images from '../../constants/Images';

import { useWeb3, useOnboard, useAddress, useBalance } from '../../hooks/Web3Context';

import AccountBar from './AccountBar';
import ConnectButton from './ConnectButton';
import MoreLinks from '../modals/MoreLinks';
import MoreLinksButton from './MoreLinksButton';
import MainMenu from './MainMenu';

const LoadingAccountSpinner = () => (
	<span className="text-white font-medium inline-flex items-center tracking-wide px-2">
		<span className="pl-2 pr-4 py-2">Connecting</span>
		<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
			<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
	</span>
);

const Navbar = () => {
	// const [onboard, provider, address, balance] = useOnboard();
	const provider = useWeb3();
	const onboard = useOnboard();
	const address = useAddress();
	const balance = useBalance();

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMoreLinksOpen, setIsMoreLinksOpen] = useState(false);

	const toggle = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const toggleMoreLinks = () => {
		setIsMoreLinksOpen(!isMoreLinksOpen);
	};

	// SPRING
	const mobileMenuTransition = useTransition(isMobileMenuOpen, {
		from: { y: 600, opacity: 0 },
		enter: { x: 0, y: 50, opacity: 1 },
		leave: { y: 1000, opacity: 0 },
	});

	const login = async () => {
		if (!provider && onboard) {
			const selected = await onboard.walletSelect();
			console.log(selected);
			if (selected) {
				await onboard.walletCheck();
			}
		}
	};

	const logout = async () => {
		if (onboard) {
			onboard.walletReset();
			if (typeof window !== 'undefined') {
				window.location.reload();
			}
		}
	};

	return (
		<>
			{/* <!-- navbar goes here --> */}
			<header className="top-0 left-0 right-0 z-50 fixed">
				<nav className="p-4 font-ubuntu bg-gray-800">
					<div className="flex items-center">
						{/* <!-- logo --> */}
						<div>
							<Link to="/">
								<a className="hidden sm:flex">
									<img src={Images.avator} alt="brand icon" width="34" height="34" />
								</a>
							</Link>
						</div>

						{/* <!-- primary nav --> */}
						<div className="hidden sm:flex items-center">
							<MainMenu />
						</div>

						{/* <!-- secondary nav --> MD */}

						<div className="hidden md:flex items-center right-0 absolute mr-2">
							{!provider && onboard && <ConnectButton login={login} />}
							{provider && (!address || !balance) && <LoadingAccountSpinner />}
							{address && <AccountBar props={{ address, balance }} />}

							<MoreLinksButton large={true} toggle={toggleMoreLinks} />
							{isMoreLinksOpen && <MoreLinks large={true} toggle={toggleMoreLinks} isLoggedIn={address && balance} logout={logout} />}
						</div>

						{/* <!-- secondary nav bottom --> SM */}

						<div className="md:hidden w-full flex items-center right-0 fixed bottom-0 bg-gray-800 p-2 h-12">
							{!provider && onboard && <ConnectButton login={login} />}
							{address && balance && <AccountBar props={{ address, balance }} />}
							{provider && (!address || !balance) && <LoadingAccountSpinner />}

							<MoreLinksButton large={false} toggle={toggleMoreLinks} />
							{isMoreLinksOpen && <MoreLinks large={false} toggle={toggleMoreLinks} isLoggedIn={address && balance} logout={logout} />}
						</div>
					</div>
				</nav>
			</header>
			<header className="top-0 left-0 right-0 z-50 fixed mx-auto w-full sm:hidden">
				<nav>
					{/* <!-- mobile menu --> */}
					{/* <!-- mobile button goes here --> */}
					<div className="flex items-center w-screen justify-between sm:px-10 bg-gray-800">
						<div className="pl-2 py-1">
							<Link to="/">
								<a className="flex">
									<img src={Images.avator} alt="icon" width="28" height="28" />
								</a>
							</Link>
						</div>

						<span className="text-yellow-400 uppercase font-bold text-sm font-ubuntu sm:text-xl">Kingdom of the Ethemerals</span>

						<button className="pr-2" onClick={toggle}>
							<svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</nav>
				{mobileMenuTransition(
					(style, item) =>
						item && (
							<animated.div style={style} className="flex justify-center">
								<div onClick={toggle} className="fixed w-full h-screen"></div>
								<MobileMenuItems toggle={toggle} />
							</animated.div>
						)
				)}
			</header>
		</>
	);
};

export default Navbar;
