import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CoinName from '../cards/CoinName';
import CloseButton from './CloseButton';

export default NiceModal.create(({ priceFeed }) => {
	const modal = useModal();

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
					<p className="text-4xl font-light">Coin Bonuses</p>
					<p className="text-xs text-blue-900">For the {priceFeed.ticker} Market, the following Merals receive +50% bonus stats when entering battle. Meral stats can help earn more HP and ELF</p>
				</div>

				{/* CONTENT */}
				<div style={{ bottom: '10px', height: '512px' }} className=" w-full absolute">
					<div style={{ borderTop: '1px solid skyblue' }} className="h-full overflow-auto bg-blue-50 pt-2 px-4">
						<div className="grid grid-cols-2">
							<div className="pr-4">
								<p>MERALS JOINING {priceFeed.baseSymbol}:</p>
								{priceFeed && priceFeed.bonusLongs.map((bonus) => <CoinName key={bonus.cmId} logo={bonus.logo} coinname={bonus.name} />)}
							</div>
							<div>
								<p>MERALS JOINING {priceFeed.quoteSymbol}:</p>
								{priceFeed && priceFeed.bonusShorts.map((bonus) => <CoinName key={bonus.cmId} logo={bonus.logo} coinname={bonus.name} />)}
							</div>
						</div>
					</div>
				</div>
				<div style={{ bottom: '0px', backgroundColor: 'skyblue', height: '8px' }} className="absolute w-full"></div>
			</div>
		</>
	);
});
