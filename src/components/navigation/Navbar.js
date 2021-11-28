import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MobileMenuItems from './MobileMenuItems';
import Images from '../../constants/Images';

import { useAuthenticated } from '../../context/Web3Context';

import useWindowSize from '../../hooks/useWindowSize';

import AccountBar from './AccountBar';
import ConnectButton from './ConnectButton';
import MoreLinks from '../modals/MoreLinks';
import MoreLinksButton from './MoreLinksButton';
import MainMenu from './MainMenu';
import useUserAccount from '../../hooks/useUserAccount';

const Navbar = () => {
	const { address } = useUserAccount();
	const isAuthenticated = useAuthenticated();

	const logout = () => {
		console.log('logout');
	};

	const windowSize = useWindowSize(898);

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMoreLinksOpen, setIsMoreLinksOpen] = useState(false);
	const [windowMed, setWindowMed] = useState(true);
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
					<nav className="px-4 py-1">
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
							{windowMed && (
								<div className="flex items-center absolute mr-4 scrollbar_right z-50">
									{!isAuthenticated && <ConnectButton />}
									{isAuthenticated && <AccountBar />}
									<MoreLinksButton large={true} toggle={toggleMoreLinks} />
									{isMoreLinksOpen && <MoreLinks large={true} toggle={toggleMoreLinks} isLoggedIn={address} logout={logout} />}
								</div>
							)}

							{/* <!-- secondary nav bottom --> SM */}
							{!windowMed && (
								<div className="w-full flex items-center mr-6 fixed left-0 bottom-0 bg-white p-2 h-12">
									{!isAuthenticated && <ConnectButton />}
									{isAuthenticated && <AccountBar />}
									<MoreLinksButton large={false} toggle={toggleMoreLinks} />
									{isMoreLinksOpen && <MoreLinks large={false} toggle={toggleMoreLinks} isLoggedIn={address} logout={logout} />}
								</div>
							)}
						</div>
					</nav>
				</header>
			)}
			{WindowXS && (
				<>
					<nav className="fixed top-0">
						{/* <!-- mobile menu --> */}
						{/* <!-- mobile button goes here --> */}
						<div className="flex items-center w-screen justify-between sm:px-10 bg-white z-50">
							<div className="pl-2 py-1">
								<Link to="/">
									<span className="flex">
										<img src={Images.avator} alt="icon" width="30" height="30" />
									</span>
								</Link>
							</div>

							<span className=" text-brandColor uppercase font-bold text-base sm:text-xl">Ethemerals</span>

							<button className="pr-2" onClick={toggle}>
								<svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="black">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							</button>
						</div>
					</nav>

					{isMobileMenuOpen && (
						<div className="fixed top-0">
							<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30"></div>
							<MobileMenuItems toggle={toggle} />
						</div>
					)}

					<div className="w-full flex items-center mr-6 fixed left-0 bottom-0 bg-white p-2 h-12 z-50">
						{!isAuthenticated && <ConnectButton />}
						{address && <AccountBar />}
						<MoreLinksButton large={false} toggle={toggleMoreLinks} />
						{isMoreLinksOpen && <MoreLinks large={false} toggle={toggleMoreLinks} isLoggedIn={address} logout={logout} />}
					</div>
				</>
			)}
		</>
	);
};

export default Navbar;
