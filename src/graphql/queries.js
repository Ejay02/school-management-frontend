import gql from "graphql-tag";

export const currentUserQuery = gql`
  query CurrentUser {
    currentUser {
      id
      username
      email
    }
  }
`;
