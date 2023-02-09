import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MobileMenuItems from './MobileMenuItems';

import useWindowSize from '../../hooks/useWindowSize';

import AccountBar from './AccountBar';
import ConnectButton from './ConnectButton';
import Images from '../../constants/Images';
import MainMenu from './MainMenu';
import MoreLinksButton from './MoreLinksButton';

import { useUser } from '../../hooks/useUser';
import { useIsWildsContext, useIsWildsHomeContext } from '../../context/MenuContext';

const headerStyleMain = {
	boxShadow: '0px 0px 26px hsla(0,0%,50%,0.25)',
	backgroundColor: 'white',
};

const headerStyleWildsHome = {};

const headerStyleWilds = {
	boxShadow: '0px 0px 26px hsla(0,0%,50%,0.25)',
	backgroundColor: '#f6f2fd',
};

const Navbar = () => {
	const { isAuthenticated } = useUser();
	const isWildsHome = useIsWildsHomeContext();
	const isWilds = useIsWildsContext();

	const windowSize = useWindowSize(898);

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [headerStyle, setHeaderStyle] = useState(headerStyleMain);
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

	useEffect(() => {
		if (!isWildsHome && !isWilds) {
			setHeaderStyle(headerStyleMain);
		} else {
			setHeaderStyle(headerStyleWilds);
		}

		if (isWildsHome) {
			setHeaderStyle(headerStyleWildsHome);
		}

		return () => {
			setHeaderStyle(headerStyleMain);
		};
	}, [isWildsHome, isWilds]);

	const toggle = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<>
			{/* <!-- navbar goes here --> */}
			{!WindowXS && (
				<header style={headerStyle} className="top-0 left-0 right-0 absolute z-30 h-12">
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
					<nav className="fixed top-0">
						{/* <!-- mobile menu --> */}
						{/* <!-- mobile button goes here --> */}
						<div className="flex items-center w-screen justify-between sm:px-10 bg-white z-50">
							<div className="pl-2 py-1">
								<Link to="/">
									<span className="flex">
										<img src={Images.ELFLogo} alt="icon" width="30" height="30" />
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
						{isAuthenticated && <AccountBar />}
						<MoreLinksButton large={false} />
					</div>
				</>
			)}
		</>
	);
};

export default Navbar;
