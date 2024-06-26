import { Injectable } from '@angular/core';
import { Apollo, MutationResult, QueryRef } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { environment } from 'src/environments/environment';

const serverApiKey = environment.serverApiKey ?? '';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  query<T>(
    query: DocumentNode,
    variables?: unknown,
    inputToken?: string,
  ): Observable<ApolloQueryResult<T>> {
    let headers;

    if (inputToken) {
      headers = { Authorization: `Bearer ${inputToken}` };
    } else {
      headers = {};
    }

    const queryRef: QueryRef<T> = this.apollo.use('default').watchQuery({
      query,
      variables,
      context: {
        headers,
      },
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    });

    return queryRef.valueChanges;
  }

  mutate<T>(mutation: DocumentNode, variables?: unknown): Observable<MutationResult<T>> {
    const token = serverApiKey;
    let headers;

    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    } else {
      headers = {};
    }

    return this.apollo.mutate<T>({
      mutation,
      variables,
      context: {
        headers,
      },
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    });
  }
}
