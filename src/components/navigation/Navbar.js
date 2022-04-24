import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import MobileMenuItems from './MobileMenuItems';
import Images from '../../constants/Images';

import useWindowSize from '../../hooks/useWindowSize';

import AccountBar from './AccountBar';
import ConnectButton from './ConnectButton';

import MainMenu from './MainMenu';
import MoreLinksButton from './MoreLinksButton';

import { useUser } from '../../hooks/useUser';

const Navbar = () => {
	const { isAuthenticated } = useUser();

	const windowSize = useWindowSize(898);

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

	return (
		<>
			{/* <!-- navbar goes here --> */}
			{!WindowXS && (
				<header style={{ boxShadow: '0px 0px 26px hsla(0,0%,50%,0.25)' }} className="top-0 left-0 right-0 absolute z-30 bg-white h-12">
					<nav className="h-12 top-0">
						<div className="flex items-center h-12">
							{/* <!-- primary nav --> */}
							<MainMenu />

							{/* <!-- secondary nav --> MD */}
							<div className={`${windowMed ? 'flex items-center absolute mr-4 scrollbar_right z-50' : 'w-full flex justify-end items-center mr-6 fixed left-0 bottom-0 bg-white px-2 h-12'}`}>
								{!isAuthenticated && <ConnectButton />}
								{isAuthenticated && <AccountBar />}
								<MoreLinksButton large={windowMed} />
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
						<MoreLinksButton large={false} />
					</div>
				</>
			)}
		</>
	);
};

export default Navbar;
