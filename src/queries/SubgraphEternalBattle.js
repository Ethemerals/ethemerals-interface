import gql from 'graphql-tag';

export const GET_EBSTAKES_BY_PRICEFEEDID = gql`
	query ($priceFeedId: Int!) {
		ebstakeActives(first: 100, where: { active: true, priceFeedId: $priceFeedId }) {
			id
			timestamp
			meral {
				id
				type
				tokenId
				meralId
				hp
				elf
				xp
				atk
				def
				spd
				element
				cmId
				coin
				name
				subclass
				mainclass
			}
			owner {
				id
			}
			priceFeedId
			positionSize
			startingPrice
			long
		}
	}
`;

export const GET_EBSTAKES_RECORD_BY_PRICEFEEDID = gql`
	query ($priceFeedId: Int!) {
		ebstakesRecord(first: 100, where: { active: false, priceFeedId: $priceFeedId }) {
			id
			startTime
			endTime
			meral {
				id
				type
				tokenId
				meralId
				hp
				elf
				xp
				atk
				def
				spd
				element
				cmId
				coin
				name
				subclass
				mainclass
			}
			owner {
				id
			}
			priceFeedId
			positionSize
			startingPrice
			long
			hp
			elf
			revived
			reviver {
				id
			}
		}
	}
`;
