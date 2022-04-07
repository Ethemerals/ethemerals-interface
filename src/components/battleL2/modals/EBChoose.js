import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useHistory } from 'react-router-dom';
import { useUserAccount } from '../../../hooks/useUser';
import MeralList from '../cards/MeralList';
import CloseButton from './CloseButton';
import Loading from './Loading';

export default NiceModal.create(({ modalToShow, modalOptions }) => {
	const history = useHistory();
	const modal = useModal();

	const { userPMerals, isLoading } = useUserAccount();

	const toggle = () => {
		modal.remove();
	};

	const selectAndToggle = async (id) => {
		userPMerals.forEach((meral) => {
			if (parseInt(meral.meralId) === parseInt(id)) {
				NiceModal.show(modalToShow, { ...modalOptions, meral });
				modal.remove();
			}
		});
	};

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30 z-30"></div>
			<div className="w-512 h-512 fixed center rounded-xl shadow-xl bg-white z-50 overflow-hidden">
				{/* TOP */}
				<div className="flex justify-end">
					<CloseButton toggle={toggle} />
				</div>

				{/* HEADER */}
				<div className="px-4">
					<p className="text-4xl font-light">Select a Meral</p>
					<p className="text-gray-600 text-lg">{modalOptions && modalOptions.subtext && modalOptions.subtext}</p>
					<p
						onClick={() => {
							history.push(`/register`);
							toggle();
						}}
						className="text-xs text-blue-400 hover:text-blue-600 cursor-pointer"
					>
						Missing Merals? Send one through the Portal here
					</p>
				</div>

				{/* CONTENT */}
				<div style={{ bottom: '-36px' }} className="h-96 w-full absolute">
					<h2 className="text-sm text-gray-600 px-4">AVAILABLE MERALS:</h2>
					<div style={{ borderTop: '1px solid skyblue' }} className="h-80 overflow-auto bg-blue-50 pt-2">
						{isLoading ? <Loading /> : userPMerals && <MeralList nfts={userPMerals} select={selectAndToggle} />}
					</div>
					<div style={{ backgroundColor: 'skyblue', height: '44px' }}></div>
				</div>
			</div>
		</>
	);
});
