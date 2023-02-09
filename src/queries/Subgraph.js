import gql from 'graphql-tag';

export const GET_OWNER = gql`
	query ($id: ID!) {
		meral(id: $id) {
			owner {
				id
			}
			previousOwner {
				id
			}
		}
	}
`;

export const GET_COINNAME = gql`
	query ($id: ID!) {
		meral(id: $id) {
			coin
		}
	}
`;

export const GET_CORE = gql`
	query ($id: ID!) {
		core(id: $id) {
			id
			mintPrice
			maxAvailableIndex
			ethemeralSupply
			burnCount
			burnLimit
			burnMaxId
		}
	}
`;

export const GET_DELEGATES = gql`
	query {
		delegates(first: 100, orderBy: timestamp, orderDirection: asc) {
			id
			timestamp
			active
		}
	}
`;

export const GET_NFT = gql`
	query ($id: ID!) {
		meral(id: $id) {
			id
			tokenId
			meralId
			proxy
			type
			timestamp
			creator {
				id
			}
			owner {
				id
			}
			cmId
			edition
			hp
			elf
			xp
			atk
			def
			spd
			atkBonus
			defBonus
			spdBonus
			element
			petRedeemed
			actions(first: 10, orderBy: timestamp, orderDirection: desc) {
				id
				timestamp
				transaction {
					id
					from
					to
				}
				type
				description
			}
			scorecard {
				highestScore
				highestRewards
				battles
				wins
				revived
				reviver
				reaped
				reaper
			}
			metadata {
				editionCount
			}
			coin
			name
			subclass
			mainclass
			artist
		}
	}
`;

export const GET_ACCOUNT = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			elfBalance
			allowDelegates
			merals(orderBy: timestamp, orderDirection: desc) {
				id
				tokenId
				meralId
				proxy
				type
				timestamp
				hp
				elf
				xp
				atk
				def
				spd
				atkBonus
				defBonus
				spdBonus
				cmId
				element
				scorecard {
					battles
				}
				coin
				name
				mainclass
				subclass
			}
			pets(orderBy: timestamp, orderDirection: desc) {
				id
				tokenId
				timestamp
				baseId
				rarity
				atk
				def
				spd
				name
			}
			actions(first: 10, orderBy: timestamp, orderDirection: desc) {
				id
				timestamp
				account {
					id
				}
				transaction {
					id
					to
					from
				}
				type
				description
			}
		}
	}
`;

export const GET_ETERNALBATTLE_ACCOUNT = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			merals(orderBy: timestamp, orderDirection: desc) {
				id
				tokenId
				meralId
				proxy
				type
				timestamp
				hp
				elf
				atk
				def
				spd
				atkBonus
				defBonus
				spdBonus
				cmId
				element
				previousOwner {
					id
				}
				scorecard {
					battles
				}
				coin
				name
				mainclass
				subclass
				actions(first: 1, orderBy: timestamp, orderDirection: desc, where: { staked: true }) {
					id
					timestamp
					priceFeed
					staked
					long
				}
			}
		}
	}
`;

export const GET_PET = gql`
	query ($id: ID!) {
		pet(id: $id) {
			id
			baseId
			timestamp
			creator {
				id
			}
			owner {
				id
			}
			edition
			atk
			def
			spd
			rarity
			name
		}
	}
`;
