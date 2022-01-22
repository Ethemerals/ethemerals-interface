import NiceModal from '@ebay/nice-modal-react';
import EnterPortalModal from '../portal/modals/EnterPortalModal';
import LeavePortalModal from '../portal/modals/LeavePortalModal';
import WaitingForSignature from './WaitingForSignature';

export const modalRegistry = {
	waitingForSignature: 'waiting-for-signature',
	enterPortal: 'enter-portal',
	leavePortal: 'leave-portal',
};

export const registerModals = () => {
	NiceModal.register(modalRegistry.waitingForSignature, WaitingForSignature);
	NiceModal.register(modalRegistry.enterPortal, EnterPortalModal);
	NiceModal.register(modalRegistry.leavePortal, LeavePortalModal);
};
