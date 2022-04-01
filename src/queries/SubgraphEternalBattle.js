import gql from 'graphql-tag';

export const GET_EBSTAKES_BY_PRICEFEEDID = gql`
	query ($priceFeedId: Int!) {
		ebstakeActives(first: 100, where: { active: true, priceFeedId: $priceFeedId }) {
			id
			timestamp
			meral {
				id
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
