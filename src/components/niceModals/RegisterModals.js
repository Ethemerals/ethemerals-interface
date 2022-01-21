import NiceModal from '@ebay/nice-modal-react';
import EnterPortalModal from '../portal/modals/EnterPortalModal';

import WaitingForSignature from './WaitingForSignature';

export const modalRegistry = {
	waitingForSignature: 'waiting-for-signature',
	enterPortal: 'enter-portal',
};

export const registerModals = () => {
	NiceModal.register(modalRegistry.waitingForSignature, WaitingForSignature);
	NiceModal.register(modalRegistry.enterPortal, EnterPortalModal);
};
