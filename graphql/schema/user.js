export default `
  type User {
    id: ID!
    username: String!
    email: String!
    teams: [Team!]!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getUser(id: ID!): User!
    allUsers: [User!]!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): RegisterResponse!
  }
`;
