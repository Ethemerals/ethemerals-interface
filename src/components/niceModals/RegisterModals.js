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
import UserWallet from './user/UserWallet';
import ChooseNetworks from './ChooseNetworks';
import MoreLinks from './navigation/MoreLinks';
import MainSelect from './user/MainSelect';
import BurnMeral from './minting/BurnMeral';

export const modalRegistry = {
	// MINTING
	burnMeral: 'burn-meral',
	// NAV
	moreLinks: 'more-links',
	// USER
	userWallet: 'user-wallet',
	mainSelect: 'main-select',
	chooseNetworks: 'choose-networks',
	waitingForSignature: 'waiting-for-signature',
	// PORTAL
	openPortal: 'open-portal',
	enterPortal: 'enter-portal',
	leavePortal: 'leave-portal',
	// ONSEN
	openOnsen: 'open-onsen',
	enterOnsen: 'enter-onsen',
	// RAIDING
	openDefenders: 'open-defenders',
	openAttackers: 'open-attackers',
	openLooters: 'open-looters',
	openBirthers: 'open-birthers',
	landStakeSelect: 'land-stake-select',
	landUnstake: 'land-unstake',
};

export const registerModals = () => {
	// MINTING
	NiceModal.register(modalRegistry.burnMeral, BurnMeral);
	// NAV
	NiceModal.register(modalRegistry.moreLinks, MoreLinks);
	// USER
	NiceModal.register(modalRegistry.mainSelect, MainSelect);
	NiceModal.register(modalRegistry.userWallet, UserWallet);
	NiceModal.register(modalRegistry.chooseNetworks, ChooseNetworks);
	NiceModal.register(modalRegistry.waitingForSignature, WaitingForSignature);
	// PORTAL
	NiceModal.register(modalRegistry.openPortal, Portal);
	NiceModal.register(modalRegistry.enterPortal, EnterPortalModal);
	NiceModal.register(modalRegistry.leavePortal, LeavePortalModal);
	// ONSEN
	NiceModal.register(modalRegistry.openOnsen, Onsen);
	NiceModal.register(modalRegistry.enterOnsen, EnterOnsenModal);
	// RAIDING
	NiceModal.register(modalRegistry.openDefenders, DefendersModal);
	NiceModal.register(modalRegistry.openAttackers, AttackersModal);
	NiceModal.register(modalRegistry.openLooters, LootersModal);
	NiceModal.register(modalRegistry.openBirthers, BirthersModal);
	NiceModal.register(modalRegistry.landStakeSelect, StakeSelectModal);
	NiceModal.register(modalRegistry.landUnstake, UnstakeModal);
};
