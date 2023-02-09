import NiceModal, { useModal } from '@ebay/nice-modal-react';
// import { getPriceFeeds } from '../../../constants/PriceFeedsL2';
// import Feeds from '../cards/Feeds';
import CloseButton from './CloseButton';

export default NiceModal.create(() => {
	const modal = useModal();

	// const priceFeeds = getPriceFeeds();

	const toggle = () => {
		modal.remove();
	};

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30 z-30"></div>
			<div style={{ height: '666px' }} className="w-512 fixed center rounded-xl shadow-xl bg-white z-50 overflow-hidden">
				<div className="flex justify-end">
					<CloseButton toggle={toggle} />
				</div>

				{/* HEADER */}
				<div className="px-4">
					<p className="text-4xl font-light">Select A Collection</p>
					<p className="text-xs text-blue-400 hover:text-blue-600 cursor-pointer">
						{/* TODO */}
						<a href={'https://data.chain.link/'} target="blank" rel="noreferrer">
							Missing a collection? Send an integration request here
						</a>
					</p>
				</div>

				{/* CONTENT */}
				<div style={{ bottom: '10px', height: '524px' }} className=" w-full absolute">
					<h2 className="text-sm text-gray-800 px-4">AVAILABLE COLLECTIONS</h2>
					<div style={{ borderTop: '1px solid skyblue' }} className="h-full overflow-auto bg-blue-50 pt-2 px-8">
						{/* {priceFeeds && priceFeeds.map((feed) => <Feeds key={feed.id} priceFeed={feed} toggle={toggle} />)} */}
					</div>
				</div>
				<div style={{ bottom: '0px', backgroundColor: 'skyblue', height: '8px' }} className="absolute w-full"></div>
			</div>
		</>
	);
});
