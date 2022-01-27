import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MobileMenuItems from './MobileMenuItems';
import Images from '../../constants/Images';

import useWindowSize from '../../hooks/useWindowSize';

import AccountBar from './AccountBar';
import ConnectButton from './ConnectButton';
import MoreLinks from '../modals/MoreLinks';
import MainMenu from './MainMenu';

import { useUser } from '../../hooks/useUser';

const Navbar = () => {
	const { isAuthenticated, logout } = useUser();

	const windowSize = useWindowSize(898);

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMoreLinksOpen, setIsMoreLinksOpen] = useState(false);
	const [windowMed, setWindowMed] = useState(false);
	const [WindowXS, setWindowXS] = useState(false);

	useEffect(() => {
		if (windowSize.width >= 898) {
			setWindowMed(true);
		} else {
			setWindowMed(false);
		}
		if (windowSize.width < 576) {
			setWindowXS(true);
		} else {
			setWindowXS(false);
		}
	}, [windowSize]);

	const toggle = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const toggleMoreLinks = () => {
		setIsMoreLinksOpen(!isMoreLinksOpen);
	};

	return (
		<>
			{/* <!-- navbar goes here --> */}
			{!WindowXS && (
				<header style={{ boxShadow: '0px 0px 26px hsla(0,0%,50%,0.25)' }} className="top-0 left-0 right-0 z-30 fixed bg-white">
					<nav className="px-4 py-1 h-12">
						<div className="flex items-center">
							{/* <!-- logo --> */}
							<div>
								<Link to="/">
									<span className="flex">
										<img src={Images.ELFLogo} alt="brand icon" width="24" height="24" />
									</span>
								</Link>
							</div>

							{/* <!-- primary nav --> */}
							<div className="flex items-center">
								<MainMenu />
							</div>

							{/* <!-- secondary nav --> MD */}
							<div className={`${windowMed ? 'flex items-center absolute mr-4 scrollbar_right z-50' : 'w-full flex items-center mr-6 fixed left-0 bottom-0 bg-white p-2 h-12'}`}>
								{!isAuthenticated && <ConnectButton />}
								{isAuthenticated && <AccountBar />}
								{isMoreLinksOpen && <MoreLinks large={true} toggle={toggleMoreLinks} logout={logout} />}
							</div>
						</div>
					</nav>
				</header>
			)}
			{WindowXS && (
				<>
					{isMobileMenuOpen && (
						<div className="fixed top-0">
							<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30"></div>
							<MobileMenuItems toggle={toggle} />
						</div>
					)}

					<div className="w-full flex items-center mr-6 fixed left-0 bottom-0 bg-white p-2 h-12 z-50">
						{!isAuthenticated && <ConnectButton />}
						{isAuthenticated && <AccountBar />}
						{isMoreLinksOpen && <MoreLinks large={false} toggle={toggleMoreLinks} logout={logout} />}
					</div>
				</>
			)}
		</>
	);
};

export default Navbar;
