import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import UserAccount from './UserAccount';
import UserELF from './UserElf';
import UserInventory from './UserInventory';
import MainSelect from './MainSelect';

const CloseSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
		<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
	</svg>
);

const ModalMenuItem = ({ toggle, selected, text }) => {
	return (
		<span onClick={toggle} className={`"cursor-pointer text-lg px-4 pb-2 py-3 ${selected ? 'text-black bg-blue-100' : ' text-gray-600 hover:text-blue-400 transition duration-300'}`}>
			{text}
		</span>
	);
};

const UserModal = ({ toggle, selected }) => {
	const [selectedTab, setSelectedTab] = useState(selected);
	const [isMainSelectOpen, setMainSelectOpen] = useState(false);

	const toggleMainSelectModal = () => {
		setMainSelectOpen(!isMainSelectOpen);
	};

	useEffect(() => {
		setSelectedTab(selected);
	}, [selected]);

	const toggleTab = (tab) => {
		setSelectedTab(tab);
	};

	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0 animate-fadeOnFast">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 center overflow-hidden z-30 tracking-wide shadow-xl rounded">
					{/* nav */}
					<div className="flex items-center bg-white cursor-pointer">
						<ModalMenuItem toggle={() => toggleTab(0)} selected={selectedTab === 0} toggleExtra={toggleMainSelectModal} text="Inventory" />
						<ModalMenuItem toggle={() => toggleTab(1)} selected={selectedTab === 1} text="Balance" />
						<ModalMenuItem toggle={() => toggleTab(2)} selected={selectedTab === 2} text="Account" />
						<span className="flex-grow cursor-auto"></span>
						<span onClick={toggle} className="px-4 text-gray-300 hover:text-yellow-400 transition duration-300 flex-none">
							<CloseSVG />
						</span>
					</div>

					{/* content */}
					<div className="w-full h-420 bg-blue-100 rounded rounded-t-none overflow-hidden z-30 tracking-wide shadow-xl">
						{selectedTab === 0 && <UserInventory toggle={toggle} toggleExtra={toggleMainSelectModal} />}
						{selectedTab === 1 && <UserELF />}
						{selectedTab === 2 && <UserAccount />}
					</div>

					{/* footer */}
					<div onClick={toggle} className="py-2 px-4 text-xs sm:text-sm text-blue-700 hover:text-blue-500 absolute bottom-0">
						<Link exact="true" to="/dashboard">
							More? Go to Dashboards
						</Link>
					</div>
				</div>
			</div>
			{isMainSelectOpen && <MainSelect toggle={toggleMainSelectModal} />}
		</>
	);
};

export default UserModal;
