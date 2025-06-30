import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query {
    allClients {
      id
      nom
      email
      telephone
      adresse
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation CreateClient($nom: String!, $email: String!, $telephone: String, $adresse: String) {
    createClient(nom: $nom, email: $email, telephone: $telephone, adresse: $adresse) {
      client {
        id
        nom
        email
        telephone
        adresse
      }
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $nom: String, $email: String, $telephone: String, $adresse: String) {
    updateClient(id: $id, nom: $nom, email: $email, telephone: $telephone, adresse: $adresse) {
      client {
        id
        nom
        email
        telephone
        adresse
      }
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      ok
    }
  }
`;
