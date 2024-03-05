import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
	query getPosts($skip: Int!, $take: Int!) {
		getPosts(skip: $skip, take: $take) {
			id
			text
			video
			user {
				id
				fullname
				email
				image
			}
			likes {
				id
				userId
				postId
			}
		}
	}
`;
