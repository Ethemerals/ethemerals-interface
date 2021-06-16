import gql from 'graphql-tag';

export const GET_POOL = gql`
	query ($id: ID!) {
		pool(id: $id) {
			token0Price
			token1Price
		}
	}
`;
