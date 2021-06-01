import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import useOnboard from '../../hooks/useOnboard';

// import { useWeb3, useUserData, useLoadingUserData, useOnboard, useWallet } from './hooks/Web3Context';
// import { usePage } from './hooks/PageContext';

import AccountBar from './AccountBar';
import ConnectButton from './ConnectButton';
import MoreLinks from '../modals/MoreLinks';
import MoreLinksButton from './MoreLinksButton';
import MainMenu from './MainMenu';

const logo = 'https://firebasestorage.googleapis.com/v0/b/cbae-f9c77.appspot.com/o/images%2Ffrontend%2Flogo.png?alt=media&token=e90250de-4f46-42c5-9de8-9e5bbdfbf904';

const Navbar = () => {
	const [onboard, provider, address, balance] = useOnboard();

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMoreLinksOpen, setIsMoreLinksOpen] = useState(false);

	const toggle = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const toggleMoreLinks = () => {
		setIsMoreLinksOpen(!isMoreLinksOpen);
	};

	const LoadingAccountSpinner = () => (
		<span className="text-white font-medium inline-flex items-center tracking-wide px-2">
			<span className="pl-2 pr-4 py-2">Connecting</span>
			<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
				<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		</span>
	);

	const login = async () => {
		if (!provider && onboard) {
			const selected = await onboard.walletSelect();
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
			<header className="top-0 left-0 right-0 z-20 bg-transparent sm:bg-gray-800 fixed">
				<nav className="container">
					<div className="flex items-center">
						{/* <!-- logo --> */}
						<div>
							<Link to="/">
								<img src={logo} alt="brand icon" width="30" height="30" className="cursor-pointer ml-2 xs:py-2 lg:py-4 mr-2" />
							</Link>
						</div>

						{/* <!-- primary nav --> */}
						<div className="hidden lg:flex items-center">
							<MainMenu />
						</div>
						<div className="hidden lg:hidden sm:flex items-center space-x-1 right-0 sm:absolute">
							<MainMenu />
						</div>

						{/* <!-- secondary nav --> LARGE */}
						<div className="hidden lg:flex items-center right-0 absolute mr-2">
							{!provider && onboard && <ConnectButton login={login} />}
							{provider && (!address || !balance) && <LoadingAccountSpinner />}
							{address && balance && <AccountBar props={{ address, balance }} />}

							<MoreLinksButton large={true} toggle={toggleMoreLinks} />
							{isMoreLinksOpen && <MoreLinks large={true} toggle={toggleMoreLinks} isLoggedIn={address && balance} logout={logout} />}
						</div>

						{/* <!-- secondary nav bottom --> SMALL */}
						<div className="lg:hidden w-full flex items-center right-0 fixed bottom-0 bg-gray-800 py-2 px-2 h-12">
							{!provider && onboard && <ConnectButton login={login} />}
							{address && balance && <AccountBar props={{ address, balance }} />}
							{provider && (!address || !balance) && <LoadingAccountSpinner />}

							<MoreLinksButton large={false} toggle={toggleMoreLinks} />
							{isMoreLinksOpen && <MoreLinks large={false} toggle={toggleMoreLinks} isLoggedIn={address && balance} logout={logout} />}
						</div>
					</div>
				</nav>

				<div className="justify-center">
					{/* <!-- MOBILE MENU--> */}
					{/* <!-- mobile button goes here --> */}
					<div className="sm:hidden flex items-center fixed top-3 right-4">
						<button className="mobile-menu-button" onClick={toggle}>
							<svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>

					<div className={isMobileMenuOpen ? 'md:hidden' : 'hidden'}>
						<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen"></div>
						<div className="fixed top-14 right-0 w-full px-4 bg-black text-right py-4">
							<Link to="/">
								<span onClick={toggle} href="#" className="block py-2 px-7 text-sm text-right text-white hover:text-gray-300">
									Mint
								</span>
							</Link>
							<Link to="/ethemerals">
								<span onClick={toggle} href="#" className="block py-2 px-7 text-sm text-right text-white hover:text-gray-300">
									Ethemerals
								</span>
							</Link>
							<Link to="/battle">
								<span onClick={toggle} href="#" className="block py-2 px-7 text-sm text-right text-white hover:text-gray-300">
									Battle
								</span>
							</Link>
							<Link to="/marketplace">
								<span onClick={toggle} href="#" className="block py-2 px-7 text-sm text-right text-white hover:text-gray-300">
									Marketplace
								</span>
							</Link>
							<Link to="/art">
								<span onClick={toggle} href="#" className="block py-2 px-7 text-sm text-right text-white hover:text-gray-300">
									Art
								</span>
							</Link>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Navbar;
