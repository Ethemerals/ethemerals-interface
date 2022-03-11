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

export const GET_CORE = gql`
	query ($id: ID!) {
		core(id: $id) {
			id
			mintPrice
			maxAvailableIndex
			ethemeralSupply
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
			atk
			def
			spd
			atkBonus
			defBonus
			spdBonus
			element
			petRedeemed
			actions(first: 10, orderBy: timestamp, orderDirection: desc) {
				timestamp
				win
				transaction {
					id
					from
					to
				}
				type
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
				meral {
					tokenId
					meralId
				}
				pet {
					tokenId
				}
				transaction {
					id
					to
					from
				}
				type
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
