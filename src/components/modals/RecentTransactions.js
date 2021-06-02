import { Link } from 'react-router-dom';

import Links from '../../constants/Links';

const RecentTransactions = ({ toggle }) => {
	return (
		<>
			<div onClick={toggle} className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-40 bg-opacity-60 bg-black">
				<div className="mx-5 w-50vw max-w-420 max-h-420 relative border-gray-400 bg-opacity-100 bg-gray-700 rounded-xl flex justify-center">
					<div className="vertical-center text-center">
						<p className="text-xl">Mainnet Launch In:</p>

						<p className="text-xs md:text-sm">
							Can't wait? Join our{' '}
							<a href={Links.DISCORD} target="_blank" className="hover:text-white">
								discord
							</a>{' '}
							and become a beta tester
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default RecentTransactions;
