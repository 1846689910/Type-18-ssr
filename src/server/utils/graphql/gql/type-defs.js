const { gql } = require("apollo-boost");
module.exports = gql`
  type Query {
    hello: String
    # students(name: String, age: Int, sex: String): [Student]!
    # student(id: ID): Student!
    landmarks: [Landmark]!
    # allLandmarks: [Landmark]!
    landmark(name: String): Landmark!
  }
  # type Student {
  #   id: ID!
  #   name: String!
  #   age: Int!
  #   sex: String!
  #   gpa: Float!
  # }
  type Landmark {
    id: ID!
    name: String!
    address: String!
    url: String!
    description: String!
    coordinates: [Float!]!
  }
  type Mutation { # CRUD operation
    # createStudent(student: StudentInput): Boolean!
    # deleteStudent(id: ID): Boolean!
    # updateStudent(id: ID, student: StudentInput): Student!
    createLandmark(landmark: LandmarkInput!): Landmark!
    deleteLandmark(id: ID!): Landmark!
    updateLandmark(id: ID!, landmark: LandmarkInput!): Landmark!
  }
  # input StudentInput {
  #   id: ID!
  #   name: String!
  #   age: Int!
  #   sex: String!
  #   gpa: Float!
  # }
  input LandmarkInput {
    id: ID
    name: String!
    address: String!
    url: String!
    description: String!
    coordinates: [Float!]!
  }
`;