import gql from 'graphql-tag';

export const GET_ACCOUNTS = gql`
	query {
		accounts {
			id
			elfBalance
		}
	}
`;

export const GET_ACCOUNT = gql`
	query($id: ID!) {
		account(id: $id) {
			id
			elfBalance
			disallowDelegates
			ethemerals(orderBy: id, orderDirection: asc) {
				id
			}
		}
	}
`;
