import NiceModal from '@ebay/nice-modal-react';

import WaitingForSignature from './WaitingForSignature';
import Onsen from '../onsen/modals/Onsen';
import EnterOnsenModal from '../onsen/modals/EnterOnsenModal';

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
import RegisterMeral from '../proxyMerals/modals/RegisterMeral';

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
	// MERAL MANAGER
	registerMeral: 'register-meral',
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
	// MERAL MANAGER
	NiceModal.register(modalRegistry.registerMeral, RegisterMeral);
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
