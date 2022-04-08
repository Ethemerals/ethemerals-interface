import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Links } from '../../constants/Links';
import { useChain } from 'react-moralis';

import { Networks } from '../chains/Networks';

export default NiceModal.create(() => {
	const modal = useModal();
	const { switchNetwork } = useChain();

	const toggle = async () => {
		modal.remove();
	};

	const handleMenuClick = async (network) => {
		console.log('switch to: ', Networks[network].value);
		try {
			await switchNetwork(Networks[network].key);
		} catch (error) {}

		toggle();
	};

	return (
		<div className="w-full h-full absolute top-0 left-0 animate-fadeOnFast z-50">
			<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
			<div className="w-64 p-2 py-4 fixed center z-30 tracking-wide shadow-xl rounded bg-white border-2">
				<div className="flex ml-2 text-gray-400 text-xs pb-2 pt-1">
					<span>Switch Network To:</span>
				</div>
				<button onClick={() => handleMenuClick(0)} className="px-2 h-10 mr-2 z-30 focus:outline-none flex items-center justify-center text-black hover:text-blue-600 rounded transition duration-300">
					<div className="flex items-center ">
						{Networks[0].icon}
						<span className="px-2 text-xs font-bold">{Networks[0].value}</span>
					</div>
				</button>
				<button onClick={() => handleMenuClick(1)} className="px-2 h-10 mr-2 focus:outline-none flex items-center justify-center text-black hover:text-blue-600 rounded transition duration-300">
					<div className="flex items-center ">
						{Networks[1].icon}
						<span className="px-2 text-xs font-bold">{Networks[1].value}</span>
					</div>
				</button>
				<div className="h-6"></div>

				{parseInt(process.env.REACT_APP_NETWORK) !== 1 && (
					<>
						<hr></hr>
						<div className="flex ml-2 text-gray-400 text-xs pb-2 pt-1">
							<span>TESTNETS</span>
						</div>
						<button onClick={() => handleMenuClick(2)} className="px-2 h-10 mr-2 focus:outline-none flex items-center justify-center text-black hover:text-blue-600 rounded transition duration-300">
							<div className="flex items-center ">
								{Networks[2].icon}
								<span className="px-2 text-xs font-bold">{Networks[2].value}</span>
							</div>
						</button>
						<button onClick={() => handleMenuClick(3)} className="px-2 h-10 mr-2 focus:outline-none flex items-center justify-center text-black hover:text-blue-600 rounded transition duration-300">
							<div className="flex items-center ">
								{Networks[3].icon}
								<span className="px-2 text-xs font-bold">{Networks[3].value}</span>
							</div>
						</button>
						<div className="h-6"></div>
					</>
				)}
				<div className="flex ml-2 text-gray-400 text-xs pb-2 pt-1">
					<span>Need Help?</span>
				</div>
				<div className="text-gray-400 justify-center flex space-x-6 text-xs">
					<a href={Links.DISCORD} target="_blank" rel="noreferrer" className="hover:text-gray-500 flex items-center">
						<span className="mr-1">DISCORD</span>
						<svg width="14" height="14" viewBox="0 0 201 144" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path d="M147.881 143.781C147.881 143.781 141.717 136.461 136.58 129.991C159.011 123.693 167.573 109.733 167.573 109.733C160.553 114.33 153.874 117.565 147.881 119.778C139.32 123.353 131.101 125.736 123.053 127.098C106.614 130.162 91.5456 129.311 78.7034 126.928C68.9428 125.055 60.5524 122.331 53.5318 119.607C49.5935 118.075 45.3126 116.203 41.0318 113.82C40.5181 113.478 40.0044 113.308 39.4908 112.968C39.1483 112.798 38.9771 112.628 38.8058 112.457C35.7236 110.755 34.0113 109.563 34.0113 109.563C34.0113 109.563 42.2305 123.182 63.9771 129.651C58.8401 136.12 52.5044 143.781 52.5044 143.781C14.662 142.589 0.278412 117.905 0.278412 117.905C0.278412 63.0888 24.9359 18.6571 24.9359 18.6571C49.5935 0.27159 73.0527 0.782298 73.0527 0.782298L74.7648 2.82513C43.9428 11.6774 29.7305 25.1261 29.7305 25.1261C29.7305 25.1261 33.4976 23.0832 39.8332 20.1893C58.1551 12.1881 72.7098 9.97507 78.7034 9.46434C79.7306 9.2941 80.587 9.12386 81.6141 9.12386C92.0591 7.76199 103.874 7.42152 116.203 8.78338C132.47 10.656 149.936 15.4227 167.744 25.1261C167.744 25.1261 154.217 12.3584 125.107 3.50608L127.504 0.782298C127.504 0.782298 150.963 0.27159 175.621 18.6571C175.621 18.6571 200.278 63.0888 200.278 117.905C200.278 117.905 185.723 142.589 147.881 143.781ZM68.2578 64.2805C58.4976 64.2805 50.7921 72.7921 50.7921 83.1768C50.7921 93.5614 58.6688 102.073 68.2578 102.073C78.0184 102.073 85.7234 93.5614 85.7234 83.1768C85.8948 72.7921 78.0184 64.2805 68.2578 64.2805ZM130.758 64.2805C120.998 64.2805 113.292 72.7921 113.292 83.1768C113.292 93.5614 121.169 102.073 130.758 102.073C140.518 102.073 148.223 93.5614 148.223 83.1768C148.223 72.7921 140.518 64.2805 130.758 64.2805Z" />
						</svg>
					</a>

					<a href={Links.TWITTER} target="_blank" rel="noreferrer" className="hover:text-gray-500 flex items-center">
						<span className="mr-1">TWITTER</span>
						<svg width="14" height="14" viewBox="0 0 204 163" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path d="M203.522 20.2007C196.257 23.3065 187.955 25.377 179.652 26.4123C187.955 21.236 195.22 12.954 198.333 3.63668C190.03 8.81296 181.728 11.9187 171.349 13.9892C164.085 5.7072 152.668 0.530884 141.252 0.530884C118.42 0.530884 99.7385 19.1655 99.7385 41.9411C99.7385 45.0469 99.7386 48.1526 100.776 51.2584C66.5278 49.1878 35.3926 32.6238 14.6359 7.77764C11.5223 13.9892 9.44667 21.236 9.44667 28.4828C9.44667 42.9763 16.7116 55.3995 28.1278 62.6462C20.8629 62.6462 14.6359 60.5757 9.44667 57.47C9.44667 77.1398 23.9764 94.7391 42.6574 97.8449C39.5439 98.8801 35.3927 98.8802 31.2413 98.8802C28.1278 98.8802 26.0521 98.8801 22.9386 97.8449C28.1278 114.409 43.6954 126.832 62.3764 126.832C47.8467 138.22 30.2035 144.431 10.4846 144.431C7.37106 144.431 4.25755 144.431 0.106201 143.396C18.7873 154.784 40.5818 162.031 64.4521 162.031C141.252 162.031 182.765 98.8802 182.765 44.0116V38.8353C191.068 35.7296 198.333 28.4827 203.522 20.2007Z" />
						</svg>
					</a>
				</div>
			</div>
		</div>
	);
});
