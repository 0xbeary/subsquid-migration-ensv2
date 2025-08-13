# ENS Subgraph Migration to Squid SDK with Subgraph GraphQL Dialect

This template demonstrates the use of Squid SDK's GraphQL server with The Graph Protocol's Subgraph GraphQL dialect. Starting with the `schema.graphql` file and using the GraphQL dialect, this squid demonstrates how to easily achieve parity with The Graph Protocol. This is achieved using Squid's GraphQL server with the built-in `--dialect thegraph` command when serving the data.

## Playground

You can test the squid with subgraph dialect here - https://void.squids.live/ens-squid:prod/api/graphql.

## Quick start

Dependencies: Node.js, Docker.

```bash
npm ci
npm run build
npm run db:up
npm run process
```

To start the GraphQL server with The Graph dialect (subgraph-compatible queries), open a separate terminal and run:

```bash
npm run serve
```

## Cloud Deployment

For managed cloud deployment of the indexer to SQD Cloud, please refer to https://docs.sqd.ai/cloud/.

For cloud deployment, you will need:

1. The Subsquid CLI (only required for deployment):
```bash
npm i -g @subsquid/cli
```

2. An Auth key (which you can get from https://app.subsquid.io/squids)

**Note**: The Subsquid CLI is only needed for cloud deployment. All local development can be done using the npm scripts above.

Note: The GraphQL server now supports The Graph subgraph query syntax (e.g., `first`, `orderBy`, `orderDirection`) for easy migration from subgraphs.

Details: https://docs.subsquid.io/

## Notes

- `schema.graph` does not contain any events as mentioned [here](https://discord.com/channels/857105545135390731/1159824199762837615/1160200633366872096).

- The [saveMany](https://github.com/subsquid/squid-sdk/blob/master/typeorm/typeorm-store/src/store.ts#L97) method is kind of slow. I had to monkey patch it in this project.
- We can't use `nameByHash`, so we cant resolve lots of real label names including 'eth'.
- **Updated for compatibility**: Fixed TypeScript compilation issues and added The Graph dialect support for subgraph-compatible queries.

## Development Commands

```bash
# Generate TypeScript types from schema
npm run codegen

# Build the project
npm run build

# Start database
npm run db:up

# Run the processor
npm run process

# Start GraphQL server with The Graph dialect
npm run serve

# Reset database (if needed)
npm run db:down && npm run db:up

# Generate TypeScript classes for ABIs
npm run typegen

# Apply database migrations
npm run migration:apply

# Generate database migrations
npm run migration:generate

# Clean build artifacts
npm run clean

# Bump @subsquid packages to latest versions
npm run bump
```

## Example

Use JSON diff tools to compare results.

### squid

query

```graphql
query MyQuery {
  domainById(id: "0x304d804ffcf2b8c189bc1a113bd74dcba4e055266e4b1b30a9fabb47a42700bb") {
    id
    owner {
      id
    }
    name
    createdAt
    expiryDate
    registrant {
      id
    }
    registration {
      cost
      expiryDate
      id
      labelName
      registrationDate
    }
    resolver {
      id
      coinTypes
      address
      contentHash
    }
    wrappedDomain {
      id
      fuses
      expiryDate
      name
    }
    wrappedOwner {
      id
    }
    labelhash
    labelName
    isMigrated
    parent {
      id
    }
    resolvedAddress {
      id
    }
    subdomainCount
  }
}

```

result

```json
{
  "data": {
    "domainById": {
      "id": "0x304d804ffcf2b8c189bc1a113bd74dcba4e055266e4b1b30a9fabb47a42700bb",
      "owner": {
        "id": "0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401"
      },
      "name": "2004fin.eth",
      "createdAt": "1696848587",
      "expiryDate": "1736160587",
      "registrant": {
        "id": "0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401"
      },
      "registration": {
        "cost": "3136267826236200",
        "expiryDate": "1728384587",
        "id": "0x0bef77380cf926336c7ac56e54e7efa75d9a67678dbc416cd51f1ece968c97c4",
        "labelName": "2004fin",
        "registrationDate": "1696848587"
      },
      "resolver": {
        "id": "0x231b0ee14048e9dccd1d247744d114a4eb5e8e63-0x304d804ffcf2b8c189bc1a113bd74dcba4e055266e4b1b30a9fabb47a42700bb",
        "coinTypes": [
          "60"
        ],
        "address": "0x231b0ee14048e9dccd1d247744d114a4eb5e8e63",
        "contentHash": null
      },
      "wrappedDomain": {
        "id": "0x304d804ffcf2b8c189bc1a113bd74dcba4e055266e4b1b30a9fabb47a42700bb",
        "fuses": 196608,
        "expiryDate": "1736160587",
        "name": "2004fin.eth"
      },
      "wrappedOwner": {
        "id": "0x01b3529309065c24a091be93ede45c99d2075db3"
      },
      "labelhash": "0x0bef77380cf926336c7ac56e54e7efa75d9a67678dbc416cd51f1ece968c97c4",
      "labelName": "2004fin",
      "isMigrated": true,
      "parent": {
        "id": "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
      },
      "resolvedAddress": {
        "id": "0x01b3529309065c24a091be93ede45c99d2075db3"
      },
      "subdomainCount": 0
    }
  }
}
```

### Subgraph

query

```graphql
query MyQuery {
  domain(id: "0x304d804ffcf2b8c189bc1a113bd74dcba4e055266e4b1b30a9fabb47a42700bb") {
    id
    owner {
      id
    }
    name
    createdAt
    expiryDate
    registrant {
      id
    }
    registration {
      cost
      expiryDate
      id
      labelName
      registrationDate
    }
    resolver {
      id
      coinTypes
      address
      contentHash
    }
    wrappedDomain {
      id
      fuses
      expiryDate
      name
    }
    wrappedOwner {
      id
    }
    labelhash
    labelName
    isMigrated
    parent {
      id
    }
    resolvedAddress {
      id
    }
    subdomainCount
  }
}
```

result

```json
{
  "data": {
    "domain": {
      "id": "0x304d804ffcf2b8c189bc1a113bd74dcba4e055266e4b1b30a9fabb47a42700bb",
      "owner": {
        "id": "0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401"
      },
      "name": "2004fin.eth",
      "createdAt": "1696848587",
      "expiryDate": "1736160587",
      "registrant": {
        "id": "0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401"
      },
      "registration": {
        "cost": "3136267826236200",
        "expiryDate": "1728384587",
        "id": "0x0bef77380cf926336c7ac56e54e7efa75d9a67678dbc416cd51f1ece968c97c4",
        "labelName": "2004fin",
        "registrationDate": "1696848587"
      },
      "resolver": {
        "id": "0x231b0ee14048e9dccd1d247744d114a4eb5e8e63-0x304d804ffcf2b8c189bc1a113bd74dcba4e055266e4b1b30a9fabb47a42700bb",
        "coinTypes": [
          "60"
        ],
        "address": "0x231b0ee14048e9dccd1d247744d114a4eb5e8e63",
        "contentHash": null
      },
      "wrappedDomain": {
        "id": "0x304d804ffcf2b8c189bc1a113bd74dcba4e055266e4b1b30a9fabb47a42700bb",
        "fuses": 196608,
        "expiryDate": "1736160587",
        "name": "2004fin.eth"
      },
      "wrappedOwner": {
        "id": "0x01b3529309065c24a091be93ede45c99d2075db3"
      },
      "labelhash": "0x0bef77380cf926336c7ac56e54e7efa75d9a67678dbc416cd51f1ece968c97c4",
      "labelName": "2004fin",
      "isMigrated": true,
      "parent": {
        "id": "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
      },
      "resolvedAddress": {
        "id": "0x01b3529309065c24a091be93ede45c99d2075db3"
      },
      "subdomainCount": 0
    }
  }
}
```

## Examples of other entities

### Domains

This is comparing first 100 by id_ASC.

I excluded `labelName` and `name` from here. Because we cannot use `nameByHash` in squid and I wanted to use JSON diff tools to compare. But if `parent.id` and `labelhash` match, then indexing is almost 100% successful I think. The original subgraph left `labelName` as `null` when couldn't extract the real `labelname`. Even so, they construct and put `name` as `[<labelhash>].<parent.name>`.

squid (with The Graph dialect)

```graphql
query MyQuery {
  domains(first: 100, orderBy: id, orderDirection: asc) {
    id
    createdAt
    expiryDate
    isMigrated
    labelhash
    owner {
      id
    }
    parent {
      id
    }
    registrant {
      id
    }
    registration {
      id
    }
    subdomainCount
    ttl
    wrappedDomain {
      id
    }
    wrappedOwner {
      id
    }
  }
}
```


subgraph

```graphql
{
  domains(first: 100, orderBy: id, orderDirection: asc) {
    id
    createdAt
    expiryDate
    isMigrated
    labelhash
    owner {
      id
    }
    parent {
      id
    }
    registrant {
      id
    }
    registration {
      id
    }
    subdomainCount
    ttl
    wrappedDomain {
      id
    }
    wrappedOwner {
      id
    }
  }
}
```

### Registration

squid (with The Graph dialect)

```graphql
query MyQuery {
  registrations(first: 50, orderBy: id, orderDirection: asc) {
    cost
    domain {
      id
    }
    expiryDate
    id
    labelName
    registrant {
      id
    }
    registrationDate
  }
}
```

subgraph

```graphql
query MyQuery {
  registrations(first: 50, orderBy: id, orderDirection: asc) {
    cost
    domain {
      id
    }
    expiryDate
    id
    labelName
    registrant {
      id
    }
    registrationDate
  }
}
```

### WrappedDomain

squid

```graphql
query MyQuery {
  wrappedDomains(limit: 50, orderBy: id_ASC) {
    id
    expiryDate
    fuses
    name
    owner {
      id
    }
    domain {
      id
    }
  }
}

```

subgraph

```graphql
query MyQuery {
  wrappedDomains(first: 50, orderBy: id, orderDirection: asc) {
    id
    expiryDate
    fuses
    name
    owner {
      id
    }
    domain {
      id
    }
  }
}
```

### Account

squid

```graphql
query MyQuery {
  accounts(limit: 50, orderBy: id_ASC) {
    id
  }
}
```

subgraph

```graphql
query MyQuery {
  accounts(first: 50, orderBy: id, orderDirection: asc) {
    id
  }
}
```

### Resolver

We need to create an entity which has id: `0x0000000000000000000000000000000000000000` for event field (non nullable).
Unlike subgraphs, we can only assign an entity, not an id.

squid

```graphql
query MyQuery {
  resolvers(limit: 50, orderBy: id_ASC) {
    addr {
      id
    }
    address
    coinTypes
    contentHash
    id
    texts
    domain {
      id
    }
  }
}
```

subgraph

```graphql
query MyQuery {
  resolvers(first: 50, orderBy: id, orderDirection: asc) {
    addr {
      id
    }
    address
    coinTypes
    contentHash
    id
    texts
    domain {
      id
    }
  }
}
```


## Example - Event entities

The subgraph has a bug like below for lots of event entities.

```json
{
  "errors": [
    {
      "locations": [
        {
          "line": 9,
          "column": 5
        }
      ],
      "message": "Null value resolved for non-null field `resolver`"
    }
  ]
}
```


### DomainEventEvents

#### Transfer


Squid

```graphql
query MyQuery {
  transfers(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    owner {
      id
    }
  }
}
```

Subgraph
```graphql
query MyQuery {
  transfers(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    owner {
      id
    }
  }
}
```


#### NewOwner

Squid

```graphql
query MyQuery {
  newOwners(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    owner {
      id
    }
    parentDomain {
      id
    }
  }
}
```

Subgraph

```graphql
query MyQuery {
  newOwners(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    owner {
      id
    }
    parentDomain {
      id
    }
  }
}
```

#### NewResolver

Squid

```graphql

query MyQuery {
  newResolvers(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    resolver {
      id
    }
  }
}


```

Subgraph

```graphql
query MyQuery {
  newResolvers(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    resolver {
      id
    }
  }
}
```

#### NewTTL

Squid

```graphql
query MyQuery {
  newTtls(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    ttl
  }
}
```

Subgraph

```graphql
query MyQuery {
  newTTLs(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    ttl
  }
}
```

#### WrappedTransfer

wrong! `"id": "16934752-165",` should be `"id": "16934752-165-0",`, **already fixed**

Squid

```graphql
query MyQuery {
  wrappedTransfers(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    owner {
      id
    }
  }
}
```

Subgraph

```graphql
query MyQuery {
  wrappedTransfers(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    owner {
      id
    }
  }
}

```

#### NameWrapped

Squid

```graphql
query MyQuery {
  nameWrappeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    expiryDate
    fuses
    name
    owner {
      id
    }
    domain {
      id
    }
  }
}
```

Subgraph

```graphql
query MyQuery {
  nameWrappeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    expiryDate
    fuses
    name
    owner {
      id
    }
    domain {
      id
    }
  }
}
```

#### NameUnwrapped

Squid

```graphql
query MyQuery {
  nameUnwrappeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    owner {
      id
    }
  }
}

```

Subgraph

```graphql
query MyQuery {
  nameUnwrappeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    owner {
      id
    }
  }
}
```

#### FusesSet

Squid

```graphql
query MyQuery {
  fusesSets(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    fuses
  }
}
```

Subgraph

```graphql
query MyQuery {
  fusesSets(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    fuses
  }
}
```

#### ExpiryExtended

Squid

```graphql
query MyQuery {
  expiryExtendeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    expiryDate
  }
}
```

Subgraph

```graphql
query MyQuery {
  expiryExtendeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    domain {
      id
    }
    expiryDate
  }
}
```

### RegistrationEvent

#### NameRegistered

Squid

```graphql
query MyQuery {
  nameRegistereds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    expiryDate
    registrant {
      id
    }
    registration {
      id
    }
  }
}
```

Subgraph

```graphql
query MyQuery {
  nameRegistereds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    expiryDate
    registrant {
      id
    }
    registration {
      id
    }
  }
}
```

#### NameRenewed

Squid

```graphql
query MyQuery {
  nameReneweds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    expiryDate
    registration {
      id
    }
  }
}

```

Subgraph

```graphql
query MyQuery {
  nameReneweds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    expiryDate
    registration {
      id
    }
  }
}
```

#### NameTransferred

Squid

```graphql
query MyQuery {
  nameTransferreds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    registration {
      id
    }
    newOwner {
      id
    }
  }
}

```

Subgraph

```graphql
query MyQuery {
  nameTransferreds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    registration {
      id
    }
    newOwner {
      id
    }
  }
}
```

### ResolverEvent

#### AddrChanged

Squid

```graphql
query MyQuery {
  addrChangeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    addr {
      id
    }
    resolver {
      id
    }
  }
}

```

Subgraph

```graphql
query MyQuery {
  addrChangeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    addr {
      id
    }
    resolver {
      id
    }
  }
}
```

#### MulticoinAddrChanged

Squid

```graphql
query MyQuery {
  multicoinAddrChangeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    resolver {
      id
    }
    coinType
  }
}

```

Subgraph

```graphql
query MyQuery {
  multicoinAddrChangeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    resolver {
      id
    }
    coinType
  }
}
```


#### NameChanged

Squid

```graphql
query MyQuery {
  nameChangeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    resolver {
      id
    }
    name
  }
}

```

Subgraph

[the subgraph result](https://api.thegraph.com/subgraphs/name/ensdomains/ens/graphql?query=query+MyQuery+%7B%0A++nameChangeds%28first%3A+10%2C+orderBy%3A+id%2C+orderDirection%3A+asc%29+%7B%0A++++id%0A++++blockNumber%0A++++transactionID%0A++++resolver+%7B%0A++++++id%0A++++%7D%0A++++name%0A++%7D%0A%7D) has errors

```graphql
query MyQuery {
  nameChangeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    resolver {
      id
    }
    name
  }
}
```

#### AbiChanged

Squid

```graphql
query MyQuery {
  abiChangeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    resolver {
      id
    }
    contentType
  }
}


```

Subgraph

```graphql
query MyQuery {
  abiChangeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    resolver {
      id
    }
    contentType
  }
}
```

#### PubkeyChanged

Squid


```graphql
query MyQuery {
  pubkeyChangeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    x
    y
    resolver {
      id
    }
  }
}

```

Subgraph

```graphql
query MyQuery {
  pubkeyChangeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    x
    y
    resolver {
      id
    }
  }
}
```

#### TextChanged

Squid

```graphql
query MyQuery {
  textChangeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    key
    value
    resolver {
      id
    }
  }
}
```

Subgraph

```graphql
query MyQuery {
  textChangeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    key
    value
    resolver {
      id
    }
  }
}
```

#### ContenthashChanged

Squid

```graphql
query MyQuery {
  contenthashChangeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    resolver {
      id
    }
    hash
  }
}
```

Subgraph

```graphql
query MyQuery {
  contenthashChangeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    resolver {
      id
    }
    hash
  }
}
```

#### InterfaceChanged

Squid


```graphql
query MyQuery {
  interfaceChangeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    implementer
    interfaceID
    resolver {
      id
    }
  }
}
```

Subgraph

[the subgraph result](https://api.thegraph.com/subgraphs/name/ensdomains/ens/graphql?query=query+MyQuery+%7B%0A++nameChangeds%28first%3A+10%2C+orderBy%3A+id%2C+orderDirection%3A+asc%29+%7B%0A++++id%0A++++blockNumber%0A++++transactionID%0A++++resolver+%7B%0A++++++id%0A++++%7D%0A++++name%0A++%7D%0A%7D) has errors


```graphql
query MyQuery {
  interfaceChangeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    implementer
    interfaceID
    resolver {
      id
    }
  }
}
```

#### AuthorisationChanged

Squid


```graphql
query MyQuery {
  authorisationChangeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    isAuthorized
    owner
    resolver {
      id
    }
    target
  }
}

```

Subgraph

```txt
"message": "Null value resolved for non-null field `resolver`"
```


```graphql
query MyQuery {
  authorisationChangeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    isAuthorized
    owner
    resolver {
      id
    }
    target
  }
}
```

#### VersionChanged

Squid


```graphql
query MyQuery {
  versionChangeds(limit: 50, orderBy: id_ASC) {
    id
    blockNumber
    transactionID
    resolver {
      id
    }
    version
  }
}
```

Subgraph

```graphql
query MyQuery {
  versionChangeds(first: 50, orderBy: id, orderDirection: asc) {
    id
    blockNumber
    transactionID
    resolver {
      id
    }
    version
  }
}
```
