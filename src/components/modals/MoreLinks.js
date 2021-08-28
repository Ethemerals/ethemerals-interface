import { Link } from 'react-router-dom';

import Links from '../../constants/Links';

const landingURL = Links.LANDING_URL;
const discordURL = Links.DISCORD_URL;

const MoreLinks = ({ large, toggle, isLoggedIn, logout }) => {
	const modalTop = 'rounded-lg p-2 py-4 mx-4 top-16 right-0 w-48 bg-blue-100 absolute space-y-4 border-white border-2 shadow-lg animate-fadeOnFast';
	const modalBottom = 'rounded-lg p-2 py-4 mx-4 bottom-16 right-2 w-48 bg-blue-100 fixed space-y-4 border-white border-2 shadow-lg animate-fadeOnFast';

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30"></div>
			<div className={large ? modalTop : modalBottom}>
				{isLoggedIn ? (
					<>
						<div className="flex ml-2 text-gray-600 hover:text-gray-900 cursor-pointer w-auto space-x-2 items-center">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<Link to="/dashboard">
								<span onClick={toggle}>Dashboard</span>
							</Link>
						</div>
						<div className="flex ml-2 text-gray-600 hover:text-gray-900 cursor-pointer w-auto space-x-2 items-center">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>

							<a href="/">
								<span onClick={logout}>Logout</span>
							</a>
						</div>
						<hr className="border-white border-t-2"></hr>
					</>
				) : (
					<>
						<div className="flex ml-2 text-gray-400 w-auto space-x-2 items-center">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Dashboard</span>
						</div>
						<div className="flex ml-2 text-gray-400 w-auto space-x-2 items-center">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
							<span>Logout</span>
						</div>
						<hr className="border-white border-t-2"></hr>
					</>
				)}

				<div className="flex ml-2 text-gray-600 hover:text-gray-900 cursor-pointer w-auto space-x-2 items-center">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						/>
					</svg>
					<a href={discordURL} target="blank">
						<span onClick={toggle}>Discord</span>
					</a>
				</div>
				<div className="flex ml-2 text-gray-400 w-auto space-x-2 items-center">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>

					<span onClick={toggle} href="#">
						Help
					</span>
				</div>
				<div className="flex ml-2 text-gray-400 w-auto space-x-2 items-center">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>

					<span href="#">About</span>
				</div>
				<hr className="border-white border-t-2"></hr>
				<div className="flex ml-2 text-gray-600 hover:text-gray-900 cursor-pointer w-auto space-x-2 items-center pb-2">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						/>
					</svg>
					<Link to="/">
						<span onClick={toggle}>Home</span>
					</Link>
				</div>
			</div>
		</>
	);
};

export default MoreLinks;
