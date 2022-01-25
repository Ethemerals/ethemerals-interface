import NiceModal from '@ebay/nice-modal-react';
import EnterPortalModal from '../portal/modals/EnterPortalModal';
import LeavePortalModal from '../portal/modals/LeavePortalModal';
import WaitingForSignature from './WaitingForSignature';
import Onsen from '../onsen/modals/Onsen';
import EnterOnsenModal from '../onsen/modals/EnterOnsenModal';
import Portal from '../portal/modals/Portal';
import DefendersModal from '../wilds/lands/modals/DefendersModal';
import AttackersModal from '../wilds/lands/modals/AttackersModal';
import LootersModal from '../wilds/lands/modals/LootersModal';
import BirthersModal from '../wilds/lands/modals/BirthersModal';
import StakeSelectModal from '../wilds/lands/modals/StakeSelectModal';
import UnstakeModal from '../wilds/lands/modals/UnstakeModal';

export const modalRegistry = {
	waitingForSignature: 'waiting-for-signature',
	openPortal: 'open-portal',
	enterPortal: 'enter-portal',
	leavePortal: 'leave-portal',
	openOnsen: 'open-onsen',
	enterOnsen: 'enter-onsen',
	openDefenders: 'open-defenders',
	openAttackers: 'open-attackers',
	openLooters: 'open-looters',
	openBirthers: 'open-birthers',
	landStakeSelect: 'land-stake-select',
	landUnstake: 'land-unstake',
};

export const registerModals = () => {
	NiceModal.register(modalRegistry.waitingForSignature, WaitingForSignature);
	NiceModal.register(modalRegistry.openPortal, Portal);
	NiceModal.register(modalRegistry.enterPortal, EnterPortalModal);
	NiceModal.register(modalRegistry.leavePortal, LeavePortalModal);
	NiceModal.register(modalRegistry.openOnsen, Onsen);
	NiceModal.register(modalRegistry.enterOnsen, EnterOnsenModal);
	NiceModal.register(modalRegistry.openDefenders, DefendersModal);
	NiceModal.register(modalRegistry.openAttackers, AttackersModal);
	NiceModal.register(modalRegistry.openLooters, LootersModal);
	NiceModal.register(modalRegistry.openBirthers, BirthersModal);
	NiceModal.register(modalRegistry.landStakeSelect, StakeSelectModal);
	NiceModal.register(modalRegistry.landUnstake, UnstakeModal);
};
