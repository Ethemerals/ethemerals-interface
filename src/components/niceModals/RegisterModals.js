import NiceModal from '@ebay/nice-modal-react';
import EnterPortalModal from '../portal/modals/EnterPortalModal';
import LeavePortalModal from '../portal/modals/LeavePortalModal';
import WaitingForSignature from './WaitingForSignature';
import Onsen from '../onsen/modals/Onsen';
import EnterOnsenModal from '../onsen/modals/EnterOnsenModal';
import Portal from '../portal/modals/Portal';
import SendDefenderModal from '../wilds/lands/modals/SendDefenderModal';

export const modalRegistry = {
	waitingForSignature: 'waiting-for-signature',
	openPortal: 'open-portal',
	enterPortal: 'enter-portal',
	leavePortal: 'leave-portal',
	openOnsen: 'open-onsen',
	enterOnsen: 'enter-onsen',
	sendDefender: 'send-defender',
};

export const registerModals = () => {
	NiceModal.register(modalRegistry.waitingForSignature, WaitingForSignature);
	NiceModal.register(modalRegistry.openPortal, Portal);
	NiceModal.register(modalRegistry.enterPortal, EnterPortalModal);
	NiceModal.register(modalRegistry.leavePortal, LeavePortalModal);
	NiceModal.register(modalRegistry.openOnsen, Onsen);
	NiceModal.register(modalRegistry.enterOnsen, EnterOnsenModal);
	NiceModal.register(modalRegistry.sendDefender, SendDefenderModal);
};
