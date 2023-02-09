import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request';
import { Links } from '../constants/Links';

export const useGQLQueryL1 = (key, query, variables, config = {}) => {
	const endpoint = Links.SUBGRAPH_ENDPOINT_L1;
	const fetchData = async () => await graphQLClient.request(query, variables);
	const graphQLClient = new GraphQLClient(endpoint);

	return useQuery(key, fetchData, config);
};

export const useGQLQueryL2 = (key, query, variables, config = {}) => {
	const endpoint = Links.SUBGRAPH_ENDPOINT_L2;
	const fetchData = async () => await graphQLClient.request(query, variables);
	const graphQLClient = new GraphQLClient(endpoint);

	return useQuery(key, fetchData, config);
};
