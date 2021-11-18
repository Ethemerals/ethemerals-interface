import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MobileMenuItems from './MobileMenuItems';
import Images from '../../constants/Images';

import { useWeb3, useOnboard, useAddress, useLogin } from '../../hooks/Web3Context';
import useWindowSize from '../../hooks/useWindowSize';

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
	const provider = useWeb3();
	const onboard = useOnboard();
	const address = useAddress();
	const login = useLogin();
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
			{!WindowXS && (
				<header className="top-0 left-0 right-0 z-30 fixed bg-white shadow-md">
					<nav className="px-4 py-3">
						<div className="flex items-center">
							{/* <!-- logo --> */}
							<div>
								<Link to="/">
									<span className="flex">
										<img src={Images.avator} alt="brand icon" width="40" height="40" />
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
									{!provider && onboard && <ConnectButton login={login} />}
									{provider && !address && <LoadingAccountSpinner />}
									{address && <AccountBar />}
									<MoreLinksButton large={true} toggle={toggleMoreLinks} />
									{isMoreLinksOpen && <MoreLinks large={true} toggle={toggleMoreLinks} isLoggedIn={address} logout={logout} />}
								</div>
							)}

							{/* <!-- secondary nav bottom --> SM */}
							{!windowMed && (
								<div className="w-full flex items-center mr-6 fixed left-0 bottom-0 bg-white p-2 h-12">
									{!provider && onboard && <ConnectButton login={login} />}
									{address && <AccountBar />}
									{provider && !address && <LoadingAccountSpinner />}
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
						{!provider && onboard && <ConnectButton login={login} />}
						{address && <AccountBar />}
						{provider && !address && <LoadingAccountSpinner />}
						<MoreLinksButton large={false} toggle={toggleMoreLinks} />
						{isMoreLinksOpen && <MoreLinks large={false} toggle={toggleMoreLinks} isLoggedIn={address} logout={logout} />}
					</div>
				</>
			)}
		</>
	);
};

export default Navbar;
