
import { gql } from "@apollo/client";

export const GET_DASHBOARD_DATA = gql`
  query {
    allCommandes {
      id
      total
      lignes {
        quantite
        produit {
          id
          nom
        }
      }
    }
  }
`;
