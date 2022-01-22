import NiceModal from '@ebay/nice-modal-react';
import EnterPortalModal from '../portal/modals/EnterPortalModal';
import LeavePortalModal from '../portal/modals/LeavePortalModal';
import WaitingForSignature from './WaitingForSignature';
import Onsen from '../onsen/modals/Onsen';
import EnterOnsenModal from '../onsen/modals/EnterOnsenModal';

export const modalRegistry = {
	waitingForSignature: 'waiting-for-signature',
	enterPortal: 'enter-portal',
	leavePortal: 'leave-portal',
	openOnsen: 'open-onsen',
	enterOnsen: 'enter-onsen',
};

export const registerModals = () => {
	NiceModal.register(modalRegistry.waitingForSignature, WaitingForSignature);
	NiceModal.register(modalRegistry.enterPortal, EnterPortalModal);
	NiceModal.register(modalRegistry.leavePortal, LeavePortalModal);
	NiceModal.register(modalRegistry.openOnsen, Onsen);
	NiceModal.register(modalRegistry.enterOnsen, EnterOnsenModal);
};
