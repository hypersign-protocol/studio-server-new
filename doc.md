## Prerequisites

The first client has to register themselves. For this, they have to fill out the below form

![ui view2](https://user-images.githubusercontent.com/91577031/205581840-73b16893-6d63-43f0-9c6a-cb7ba90320b3.png)

Upon filing the details, click on the `SUBMIT` button to get registered on our server. After registration credentials will be shared via email or a file get downloaded in the browser.
A sample credential.json file:

```js
{
   "audience": "https://stage.hypermine.in/",
   "url": "https://stage.hypermine.in/studioserver/auth/token",
   "tenant_subdomain": "varsha-kumari-dplbkq",
   "client_id": "arBlWbnir4EG1DU7F4tqoRREbtsa4nxJ",
   "client_secret": "9C3_oXh85QB4Izf5NvQ_tEj_fVcKjRmP_tuXJ5GWwi51LGNVuv-WG4lEmiA0A5yM"
}

```
### API to register on studio server(/studioserver/register)

This api is for register any client on studio server before using any functionality of studio

#### URL

```js
POST  /app/register
```

#### Request Body

```js
{
"name":"Varsha kumari",
"email":"varshakumari370@gmail.com",
"organisation":"hypermine",
"organisationWebsite":"http://hypersign.id",
"country":"india",
"role":"developer",
"phoneNumber":"6202533809"
}
```

#### Response Body

```js
{
    "client_id": "assb7358vcbuututr",
    "client_secret": "5C3_oXh85QB4Izf5NvQ_tEj_fVcKjRmP_tuXJ5GWwi51LGNVuv-WG4lEmiA0A5xt",
    "kmsId": "var48458bchfuhjkd_k_012",
    "edvId": "bnkgitkhy2854jrefnf_eut84hji"
}
```
## Authorization

For calling any api client need to authenticate itself. Authentication happens on every single request by passing access_token in the header.

### API for generating access_token

Generate access token using registered client_Id, client_secret, and audience.

#### URL

```js
POST /app/auth/token
```

#### Request Body

```js
{
  "client_id": "arBlWbnir4EG1DU7F4tqoRREbtsa4nxJ",
  "client_secret":"9C3_oXh85QB4Izf5NvQ_tEj_fVcKjRmP_tuXJ5GWwi51LGNVuv-WG4lEmiA0A5yM",
  "grant_type": "client_credentials"
}
```

#### Response Body

```js
{
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqaEROemRDUlVKRVEwTTVSVFE0TmtZME9UZzVNVEpDTlVJNFJqRTBPREExTmpZMk1qazFPQSJ9.eyJodHRwOi8vbWF0dHIvdGVuYW50LWlkIjoiODRjMTE3MmMtYzhmYS00YWQzLTg0MzItOGMzOGExMzQwNDMzIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLm1hdHRyLmdsb2JhbC8iLCJzdWIiOiJhckJsV2JuaXI0RUcxRFU3RjR0cW9SUkVidHNhNG54SkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly92aWkubWF0dHIuZ2xvYmFsIiwiaWF0IjoxNjcwMjE0MzAzLCJleHAiOjE2NzAyMjg3MDMsImF6cCI6ImFyQmxXYm5pcjRFRzFEVTdGNHRxb1JSRWJ0c2E0bnhKIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.UbLHVksMLT7SmZCXWYK0juAjAemunadsfqL73A9EkZn8N7levinmIm3XJ_8ZtkSLeE6Mx6RMTJrOTwZyZxtHSmenkNDhC3T4sh4eawlLN-yhAK929TUWOVJsWCQ1eIURL1Hh15GMpPDUeFLv5KTvUgWJuthCpekScI6Bx73fffjV3IJ4YPPIfdi6k9efIkcK3vSRLQndzBjuFZEQ-E40BHR6N3S5eOZ5LUQimRQwwis3nWibR5prDoOYNC4ayZNuoTe1xm9YC5gQ5-AdMPqMvpUEaUSEi3SHxXLd2sbqYOevpEZbyXWTI91dqVxgWsq5jmY9H_FaW1C3U7ZPYbWGUg",
    "expires_in": 14400,
    "token_type": "Bearer"
}
```

## APIs

Once an access token is generated client can use the following APIs to create dids, schema, credentials, and presentation. The client will able to verify those generated credentials also.

- /api/v1/config/domain
- /api/v1/dids
- /api/v1/schema
- /api/v1/credential
- /api/v1/credential/verify
- /api/v1/presentation

### /api/v1/config/domain

This api is for creating a custom domain. A custom domain allows displaying credential or presentation requests to be rendered under the domain of preference.

#### URL

```js
 POST https://${tenant_subdomain}/studioserver/api/v1/config/domain
```

#### Request Headers:

```js
Authorization: ${access_token},
Accept: application/json
```

#### Request Body

```js
 {
    "name":"hypermine",
  "logoUrl":  "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FReal_image&psig=AOvVaw2J6tuR1GLlikZhXgtJ9IwI&ust=1669979864015000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCMDqj_al2PsCFQAAAAAdAAAAABAE",
  "domain":"hypermine.in",
  "homepage":"http://test.com"
}
```

#### Response Body

```js
{
    "name": "hypermine",
    "logoUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FReal_image&psig=AOvVaw2J6tuR1GLlikZhXgtJ9IwI&ust=1669979864015000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCMDqj_al2PsCFQAAAAAdAAAAABAE",
    "domain": "hypermine.in",
    "homepage": "http://test.com",
    "verificationToken": "8d15686a-cf07-40e6-8ec1-578911daffc7",
    "isVerified": false
}
```

### /api/v1/dids

#### Create did

This api is to create did for particular client or org.

- **URL**
  ```js
        POST /api/v1/dids
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Request Body**
  ```js
     "method" : "hid",
     "options":{
     "keyType": "ed25519"  // this could be ed25519 or bls12381g2
   }
  ```
- **Response Body**
  ```js
     {
  "did": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
  "registrationStatus": "COMPLETED",
  "localMetadata": {
      "keys": [
          {
              "didDocumentKeyId": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
              "kmsKeyId": "833d13cc-f39b-44c3-8546-83045ab8f7c4"
          },
          {
              "didDocumentKeyId": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6LSefuW6BSBeWymHzrpHXD7fF9LdKGozjsdinFAw8MAmKYz",
              "kmsKeyId": "94df902f-ab92-417d-b659-830e49e8768f"
          }
      ],
      "registered": 1669890352363,
      "initialDidDocument": {
          "@context": "https://w3.org/ns/did/v1",
          "id": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
          "publicKey": [
              {
                  "id": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
                  "type": "Ed25519VerificationKey2018",
                  "controller": ["did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"],
                  "publicKeyBase58": "D7gY7gNV8jEw9pMK1jgghuYpT7WdJXcosSUhnfFEe6ux"
              }
          ],
          "authentication": [
              "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "assertionMethod": [
              "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "capabilityDelegation": [
              "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "capabilityInvocation": [
              "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "keyAgreement": [
              {
                  "id": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6LSefuW6BSBeWymHzrpHXD7fF9LdKGozjsdinFAw8MAmKYz",
                  "type": "X25519KeyAgreementKey2019",
                  "controller": ["did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"],
                  "publicKeyBase58": "3zjLZsdKZ4G2CcV3kshALevrnAjhJ8hUqoXVSfhe3wnE"
              }
          ]
      }
    }
  }
  ```

#### Fetch did list

This api is to create did for particular client or org.

- **URL**
  ```js
        GET /api/v1/dids
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Response Body**
  ```js
  [
    {
      did: 'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
      registrationStatus: 'COMPLETED',
      localMetadata: {
        keys: [
          {
            didDocumentKeyId:
              'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
            kmsKeyId: '833d13cc-f39b-44c3-8546-83045ab8f7c4',
          },
          {
            didDocumentKeyId:
              'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6LSefuW6BSBeWymHzrpHXD7fF9LdKGozjsdinFAw8MAmKYz',
            kmsKeyId: '94df902f-ab92-417d-b659-830e49e8768f',
          },
        ],
        registered: 1669890352363,
        initialDidDocument: {
          '@context': 'https://w3.org/ns/did/v1',
          id: 'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
          publicKey: [
            {
              id: 'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
              type: 'Ed25519VerificationKey2018',
              controller: ['did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL'],
              publicKeyBase58: 'D7gY7gNV8jEw9pMK1jgghuYpT7WdJXcosSUhnfFEe6ux',
            },
          ],
          authentication: [
            'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
          ],
          assertionMethod: [
            'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
          ],
          capabilityDelegation: [
            'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
          ],
          capabilityInvocation: [
            'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
          ],
          keyAgreement: [
            {
              id: 'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6LSefuW6BSBeWymHzrpHXD7fF9LdKGozjsdinFAw8MAmKYz',
              type: 'X25519KeyAgreementKey2019',
              controller: 'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
              publicKeyBase58: '3zjLZsdKZ4G2CcV3kshALevrnAjhJ8hUqoXVSfhe3wnE',
            },
          ],
        },
      },
    },
  ];
  ```

#### Fetch/Resolve a did list

This api is to resolve a did.

- **URL**
  ```js
        GET /api/v1/dids/did
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Response Body**
  ```js
  [
    {
      did: 'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
      registrationStatus: 'COMPLETED',
      localMetadata: {
        keys: [
          {
            didDocumentKeyId:
              'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
            kmsKeyId: '833d13cc-f39b-44c3-8546-83045ab8f7c4',
          },
          {
            didDocumentKeyId:
              'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6LSefuW6BSBeWymHzrpHXD7fF9LdKGozjsdinFAw8MAmKYz',
            kmsKeyId: '94df902f-ab92-417d-b659-830e49e8768f',
          },
        ],
        registered: 1669890352363,
        initialDidDocument: {
          '@context': 'https://w3.org/ns/did/v1',
          id: 'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
          publicKey: [
            {
              id: 'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
              type: 'Ed25519VerificationKey2018',
              controller: ['did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL'],
              publicKeyBase58: 'D7gY7gNV8jEw9pMK1jgghuYpT7WdJXcosSUhnfFEe6ux',
            },
          ],
          authentication: [
            'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
          ],
          assertionMethod: [
            'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
          ],
          capabilityDelegation: [
            'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
          ],
          capabilityInvocation: [
            'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
          ],
          keyAgreement: [
            {
              id: 'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6LSefuW6BSBeWymHzrpHXD7fF9LdKGozjsdinFAw8MAmKYz',
              type: 'X25519KeyAgreementKey2019',
              controller: 'did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL',
              publicKeyBase58: '3zjLZsdKZ4G2CcV3kshALevrnAjhJ8hUqoXVSfhe3wnE',
            },
          ],
        },
      },
    },
  ];
  ```

#### Update did

This api is to update did document. We can update did document controller

- **URL**
  ```js
        PUT /api/v1/dids/${did}
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Request Body**
  ```js
     {
   "did": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
   "registrationStatus": "COMPLETED",
   "localMetadata": {
   "keys": [
          {
              "didDocumentKeyId": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
              "kmsKeyId": "833d13cc-f39b-44c3-8546-83045ab8f7c4"
          },
          {
              "didDocumentKeyId": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6LSefuW6BSBeWymHzrpHXD7fF9LdKGozjsdinFAw8MAmKYz",
              "kmsKeyId": "94df902f-ab92-417d-b659-830e49e8768f"
          }
      ],
      "registered": 1669890352363,
      "initialDidDocument": {
          "@context": "https://w3.org/ns/did/v1",
          "id": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
          "publicKey": [
              {
                  "id": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
                  "type": "Ed25519VerificationKey2018",
                  "controller": ["did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
                                       "did:hid:testnet:z9pG5PEiRfn478zCrtUF66fmuqtx5bD3KUHEqi835T8W8"
  ],
                  "publicKeyBase58": "D7gY7gNV8jEw9pMK1jgghuYpT7WdJXcosSUhnfFEe6ux"
              }
          ],
          "authentication": [
              "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "assertionMethod": [
              "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "capabilityDelegation": [
              "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "capabilityInvocation": [
              "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "keyAgreement": [
              {
                  "id": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6LSefuW6BSBeWymHzrpHXD7fF9LdKGozjsdinFAw8MAmKYz",
                  "type": "X25519KeyAgreementKey2019",
                  "controller": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
                  "publicKeyBase58": "3zjLZsdKZ4G2CcV3kshALevrnAjhJ8hUqoXVSfhe3wnE"
               }
           ]
       }
     }
  }
  ```
- **Response Body**
  ```js
     {
  "did": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
  "registrationStatus": "COMPLETED",
  "localMetadata": {
      "keys": [
          {
              "didDocumentKeyId": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
              "kmsKeyId": "833d13cc-f39b-44c3-8546-83045ab8f7c4"
          },
          {
              "didDocumentKeyId": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6LSefuW6BSBeWymHzrpHXD7fF9LdKGozjsdinFAw8MAmKYz",
              "kmsKeyId": "94df902f-ab92-417d-b659-830e49e8768f"
          }
      ],
      "registered": 1669890352363,
      "initialDidDocument": {
          "@context": "https://w3.org/ns/did/v1",
          "id": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
          "publicKey": [
              {
                  "id": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
                  "type": "Ed25519VerificationKey2018",
                  "controller": ["did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
                                       "did:hid:testnet:z9pG5PEiRfn478zCrtUF66fmuqtx5bD3KUHEqi835T8W8"
                                    ],
                 "publicKeyBase58": "D7gY7gNV8jEw9pMK1jgghuYpT7WdJXcosSUhnfFEe6ux"
             }
           ],
          "authentication": [            "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "assertionMethod": [       "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "capabilityDelegation": [     "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "capabilityInvocation": [                "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL"
          ],
          "keyAgreement": [
              {
                    "id":  "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL#z6LSefuW6BSBeWymHzrpHXD7fF9LdKGozjsdinFAw8MAmKYz",
                   "type": "X25519KeyAgreementKey2019",
                   "controller": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
                   "publicKeyBase58": "3zjLZsdKZ4G2CcV3kshALevrnAjhJ8hUqoXVSfhe3wnE"
                 }
             ]
         }
       }
  }
  ```

### /api/v1/schema

#### Create Schema

This api is for creating schema.
- **URL**
   ```js
     POST https://stage.hypermine.in/studioserver/api/v1/schema
   ```
- **Request Header**
   ```js
      Authorization: ${access_token},
      Accept: application/json
  ```
- **Request Body**
  ```js
     {
           "additionalProperties": false,
           "author": "did:hid:testnet:zC3eoUZidLnd67Hv6HyjTS6arEgKyiV85tNJwktrkUYQC",  // did of the one who is creating this schema
           "description": "schema for air ticket", // discription about the schema
           "fields": [       // attributes for the schema
               {
                   "format": "",
                   "isRequired": false,
                   "name": "PNR number",
                   "type": "string"
               },
               {
                   "format": "",
                   "isRequired": false,
                   "name": "destination",
                   "type": "string"
               },
               {
                   "format": "",
                   "isRequired": false,
                   "name": "arrival time",
                   "type": "date"
               }
           ],
           "name": "air ticket",
   }
  ```
- **Response Body**
  ```js
      {
        "schemaId":"sch:hid:devnet:zGxc4ejNrNLZyxkH72mjXsSuWGwmQbF17Puy8ML25xCiS:1.0",
        "transactionHash":"62E6E7A489D9E79773AC51A4C0DB58152FD8329E023DAA5193CEBBF0188AD82C",
        "status":"Registered",
        "additionalProperties": false,
        "author": "did:hid:testnet:zC3eoUZidLnd67Hv6HyjTS6arEgKyiV85tNJwktrkUYQC",  // did of the one who is creating this schema
           "description": "schema for air ticket", // discription about the schema,
          "name":"Air Ticket schema", // name of the schema
          "fields": [
                 {
                     "format": "",
                      "isRequired": false,
                     "name": "PNR number",
                      "type": "string"
                },
                {
                   "format": "",
                   "isRequired": false,
                   "name": "destination",
                   "type": "string"
               },
               {
                   "format": "",
                   "isRequired": false,
                   "name": "arrival time",
                   "type": "date"
               }
           ],  // attributes for the schema
   }
  ```

#### Fetch schema

This api is for fetching schema list

- URL
  ```js
  GET   https://stage.hypermine.in/studioserver/api/v1/schema
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Response Body**
  ```js
  [
    {
      schemaId: 'sch:hid:devnet:zGxc4ejNrNLZyxkH72mjXsSuWGwmQbF17Puy8ML25xCiS:1.0',
      transactionHash: '62E6E7A489D9E79773AC51A4C0DB58152FD8329E023DAA5193CEBBF0188AD82C',
      status: 'Registered',
      additionalProperties: false,
      author: 'did:hid:testnet:zC3eoUZidLnd67Hv6HyjTS6arEgKyiV85tNJwktrkUYQC', // did of the one who is creating this schema
      description: 'schema for air ticket', // discription about the schema,
      name: 'Air Ticket schema', // name of the schema
      fields: [
        {
          format: '',
          isRequired: false,
          name: 'PNR number',
          type: 'string',
        },
        {
          format: '',
          isRequired: false,
          name: 'destination',
          type: 'string',
        },
        {
          format: '',
          isRequired: false,
          name: 'arrival time',
          type: 'date',
        },
      ], // attributes for the schema
    },
  ];
  ```

### api/v1/credential

#### Create credential

This api is used for issuing verifiable credentials based on the particular schema.

- **URL**
  ```js
   POST https://stage.hypermine.in/studioserver/api/v1/credential
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Request Body**
  ```js
  {
  "issuer": {
     "id": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL", // did of the issuer
     "name": "tenant"
  },
  "@context": [
     "https://www.w3.org/2018/credentials/v1",
     "https://schema.org"
  ],
  "subjectId": "did:key:z6MkfxQU7dy8eKxyHpG267FV23agZQu9zmokd8BprepfHALi", // did of the schema
  "type": [
     "VerifiableCredential",
     "CourseCredential"
  ],
  "fields": {
             "PNR number": "1367475",
             "arrival date": "12/10/22",
             "destination": "patna",
         },
  "revocable": true // if true then credential can be revoked
  }
  ```
- **Response Body**
  ```js
      {
      "id":" we23rrbrghi3i4iikrmhngnhfmb"
      "@context": ["https://www.w3.org/2018/credentials/v1", {
         "hs": "https://jagrat.hypersign.id/rest/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zGbvNLYRxVw3LiYEWtS8Womjv8QayTsHqWqnEEXwEEa1n:1.0:"
     }, {
         "PNR number": "hs:PNR number"
     }, {
         "arrival date": "hs:arrival date"
     },  {
         "destination": "hs:destination"
     }"https://w3id.org/security/suites/ed25519-2020/v1"],
     "id": "vc:hid:testnet:z3bp6DPNMp5ZcdgDNdHmyboKgJ7YYEEwrKaPmTm4SHjbs",
     "type": ["VerifiableCredential", "Air Ticket schema"],
     "expirationDate": "2022-11-14T22:47:00Z",
     "issuanceDate": "2022-11-07T10:48:47Z",
     "issuer": "did:hid:devnet:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
     "credentialSubject": {
         "PNR number": "1367475",
             "arrival date": "12/10/22",
             "destination": "patna",
         "id": "did:hid:testnet:z4j9Exyg3Cbkq9AsMRJVSkW3q7nTriyv25WTp3rQaCLjR"
     },
     "credentialSchema": {
         "id": "sch:hid:testnet:zGbvNLYRxVw3LiYEWtS8Womjv8QayTsHqWqnEEXwEEa1n:1.0",
         "type": "JsonSchemaValidator2018"
     },
     "credentialStatus": {
         "id": "https://jagrat.hypersign.id/rest/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z3bp6DPNMp5ZcdgDNdHmyboKgJ7YYEEwrKaPmTm4SHjbs",
         "type": "CredentialStatusList2017"
     },
     "proof": {
         "type": "Ed25519Signature2020",
         "created": "2022-11-07T10:50:34Z",
         "verificationMethod": "did:hid:testnet:z4j9Exyg3Cbkq9AsMRJVSkW3q7nTriyv25WTp3rQaCLjR#key-1",
         "proofPurpose": "assertionMethod",
         "proofValue": "z3sN94D6a5RQBZbwRBhFLvRtsXwvT4926y9fDwrL8svWFaJ7T5Zpb78Z1kaDkQNakzgZvrYsUjds2GbL99avJUW2E"
     }
  }
  ```

#### Fetch credential list

This api is for fetching list of credential.

- **URL**
  ```js
   GET https://stage.hypermine.in/studioserver/api/v1/credential
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Response Body**
  ```js
  [
    {
      "id": " we23rrbrghi3i4iikrmhngnhfmb"
       "@context": ["https://www.w3.org/2018/credentials/v1", {
        "hs": "https://jagrat.hypersign.id/rest/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zGbvNLYRxVw3LiYEWtS8Womjv8QayTsHqWqnEEXwEEa1n:1.0:"
      }, {
          "PNR number": "hs:PNR number"
        }, {
          "arrival date": "hs:arrival date"
        }, {
          "destination": "hs:destination"
        }"https://w3id.org/security/suites/ed25519-2020/v1"],
      "id": "vc:hid:testnet:z3bp6DPNMp5ZcdgDNdHmyboKgJ7YYEEwrKaPmTm4SHjbs",
      "type": ["VerifiableCredential", "Air Ticket schema"],
      "expirationDate": "2022-11-14T22:47:00Z",
      "issuanceDate": "2022-11-07T10:48:47Z",
      "issuer": "did:hid:devnet:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
      "credentialSubject": {
        "PNR number": "1367475",
        "arrival date": "12/10/22",
        "destination": "patna",
        "id": "did:hid:testnet:z4j9Exyg3Cbkq9AsMRJVSkW3q7nTriyv25WTp3rQaCLjR"
      },
      "credentialSchema": {
        "id": "sch:hid:testnet:zGbvNLYRxVw3LiYEWtS8Womjv8QayTsHqWqnEEXwEEa1n:1.0",
        "type": "JsonSchemaValidator2018"
      },
      "credentialStatus": {
        "id": "https://jagrat.hypersign.id/rest/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z3bp6DPNMp5ZcdgDNdHmyboKgJ7YYEEwrKaPmTm4SHjbs",
        "type": "CredentialStatusList2017"
      },
      "proof": {
        "type": "Ed25519Signature2020",
        "created": "2022-11-07T10:50:34Z",
        "verificationMethod": "did:hid:testnet:z4j9Exyg3Cbkq9AsMRJVSkW3q7nTriyv25WTp3rQaCLjR#key-1",
        "proofPurpose": "assertionMethod",
        "proofValue": "z3sN94D6a5RQBZbwRBhFLvRtsXwvT4926y9fDwrL8svWFaJ7T5Zpb78Z1kaDkQNakzgZvrYsUjds2GbL99avJUW2E"
      }
    }
  ]
  ```

#### Update credential status

This api is to update credential status. One can either suspend credential or completely revoke it.

- **URL**
  ```js
    PUT https://stage.hypermine.in/studioserver/api/v1/credential/:id=${credentialId}
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Request Body**
  ```js
        {
           "status":"revoked",
           "status reason":" Some reason"
        }
  ```
- **Response Body**
  ```js
     {
        Credential has been reset
     }
  ```

#### Verify credential

This api is used to verify particular credential.

- **URL**
  ```js
    POST https://stage.hypermine.in/studioserver/api/v1/credential/verify
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Request Body**
  ```js
    {
     "credential": {
      "@context": ["https://www.w3.org/2018/credentials/v1", {
          "hs": "https://jagrat.hypersign.id/rest/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zGbvNLYRxVw3LiYEWtS8Womjv8QayTsHqWqnEEXwEEa1n:1.0:"
      }, {
          "PNR number": "hs:PNR number"
      }, {
          "arrival date": "hs:arrival date"
      },  {
          "destination": "hs:destination"
      }"https://w3id.org/security/suites/ed25519-2020/v1"],
      "id": "vc:hid:testnet:z3bp6DPNMp5ZcdgDNdHmyboKgJ7YYEEwrKaPmTm4SHjbs",
      "type": ["VerifiableCredential", "Air Ticket schema"],
      "expirationDate": "2022-11-14T22:47:00Z",
      "issuanceDate": "2022-11-07T10:48:47Z",
      "issuer": "did:hid:testnet:z4j9Exyg3Cbkq9AsMRJVSkW3q7nTriyv25WTp3rQaCLjR",
      "credentialSubject": {
          "PNR number": "1367475",
              "arrival date": "12/10/22",
              "destination": "patna",
          "id": "did:hid:testnet:z4j9Exyg3Cbkq9AsMRJVSkW3q7nTriyv25WTp3rQaCLjR"
      },
      "credentialSchema": {
          "id": "sch:hid:testnet:zGbvNLYRxVw3LiYEWtS8Womjv8QayTsHqWqnEEXwEEa1n:1.0",
          "type": "JsonSchemaValidator2018"
      },
      "credentialStatus": {
          "id": "https://jagrat.hypersign.id/rest/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z3bp6DPNMp5ZcdgDNdHmyboKgJ7YYEEwrKaPmTm4SHjbs",
          "type": "CredentialStatusList2017"
      },
      "proof": {
          "type": "Ed25519Signature2020",
          "created": "2022-11-07T10:50:34Z",
          "verificationMethod": "did:hid:testnet:z4j9Exyg3Cbkq9AsMRJVSkW3q7nTriyv25WTp3rQaCLjR#key-1",
          "proofPurpose": "assertionMethod",
          "proofValue": "z3sN94D6a5RQBZbwRBhFLvRtsXwvT4926y9fDwrL8svWFaJ7T5Zpb78Z1kaDkQNakzgZvrYsUjds2GbL99avJUW2E"
      }
  },
  }
  ```
- **Response Body**
  ```js
   {
       "verified": true
   }
  ```

### /api/v1/presentation

#### Create presentation template

This api is used to create a presentation template for the particular issued credential.

- **URL**
  ```js
    POST https://stage.hypermine.in/studioserver/api/v1/presentations/template
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Request Body**
  ```js
    {
           "id":"633d6ff8fcc2b5ea3ad3323e"
           "issuerDid": ["did:hid:testnet:zC3eoUZidLnd67Hv6HyjTS6arEgKyiV85tNJwktrkUYQC"],
           "callbackUrl": "http://localhost:3000",
           "domain": "hyperfyre-stage.netlify.app/",
          "name":"traveller_verify_request",
          "orgDid":"633ac071eeb1531222fdeb1e",
          "queryType":"QueryByExample",
          "reason":"Showing a valid traveller",
          "required": true,
          "schemaId":"sch:hid:testnet:zEDKz5dii18skPoPShVjzkAiZ  5fE6t6hJ3DXnaUtJ3Q73:1.0"
     }
  ```
- **Request Body**
  ```js
    {
              "id": "633d6ff8fcc2b5ea3ad3323e"
              "issuerDid": ["did:hid:testnet:zC3eoUZidLnd67Hv6HyjTS6arEgKyiV85tNJwktrkUYQC"],
              "callbackUrl": "http://localhost:3000",
              "domain": "hyperfyre-stage.netlify.app/",
               "name":"traveller_verify_request",
              "orgDid":"633ac071eeb1531222fdeb1e",
              "queryType":"QueryByExample",
              "reason":"Showing a valid traveller",
              "required": true,
              "schemaId":"sch:hid:testnet:zEDKz5dii18skPoPShVjzkAiZ5fE6t6hJ3DXnaUtJ3Q73:1.0"
     }
  ```

#### Fetch presentation template list

This api is used to fetch presentation template list.

- **URL**
  ```js
    GET https://stage.hypermine.in/studioserver/api/v1/presentations/template
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Response Body**
  ```js
    [
      {
              "id": "633d6ff8fcc2b5ea3ad3323e"
              "issuerDid": ["did:hid:testnet:zC3eoUZidLnd67Hv6HyjTS6arEgKyiV85tNJwktrkUYQC"],
              "callbackUrl": "http://localhost:3000",
              "domain": "hyperfyre-stage.netlify.app/",
               "name":"traveller_verify_request",
              "orgDid":"633ac071eeb1531222fdeb1e",
              "queryType":"QueryByExample",
              "reason":"Showing a valid traveller",
              "required": true,
              "schemaId":"sch:hid:testnet:zEDKz5dii18skPoPShVjzkAiZ5fE6t6hJ3DXnaUtJ3Q73:1.0"

      }
    ]
  ```

#### Fetch particular presentation template

This api is used to fetch presentation template by id.

- **URL**
  ```js
    GET https://stage.hypermine.in/studioserver/api/v1/presentations/template/${templateId}
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Response Body**
  ```js
      {
             "id": "633d6ff8fcc2b5ea3ad3323e"
              "issuerDid": ["did:hid:testnet:zC3eoUZidLnd67Hv6HyjTS6arEgKyiV85tNJwktrkUYQC"],
              "callbackUrl": "http://localhost:4000",
              "domain": "hyperfyre-stage.netlify.app/",
               "name":"traveller_verify_request",
              "orgDid":"633ac071eeb1531222fdeb1e",
              "queryType":"QueryByExample",
              "reason":"Showing a valid traveller",
              "required": true,
              "schemaId":"sch:hid:testnet:zEDKz5dii18skPoPShVjzkAiZ5fE6t6hJ3DXnaUtJ3Q73:1.0"
      }
  ```

#### Update presentation template

- **URL**
  ```js
    PUT https://stage.hypermine.in/studioserver/api/v1/presentations/template/${templateId}
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Request Body**
  ```js
      {
              "issuerDid": ["did:hid:testnet:zC3eoUZidLnd67Hv6HyjTS6arEgKyiV85tNJwktrkUYQC"],
              "callbackUrl": "http://localhost:4000",
              "domain": "hyperfyre-stage.netlify.app/",
               "name":"traveller_verify_request",
              "orgDid":"633ac071eeb1531222fdeb1e",
              "queryType":"QueryByExample",
              "reason":"Showing a valid traveller",
              "required": true,
              "schemaId":"sch:hid:testnet:zEDKz5dii18skPoPShVjzkAiZ5fE6t6hJ3DXnaUtJ3Q73:1.0"
      }
  ```
- **Response Body**
  ```js
      {
              "issuerDid": ["did:hid:testnet:zC3eoUZidLnd67Hv6HyjTS6arEgKyiV85tNJwktrkUYQC"],
              "callbackUrl": "http://localhost:4000",
              "domain": "hyperfyre-stage.netlify.app/",
               "name":"traveller_verify_request",
              "orgDid":"633ac071eeb1531222fdeb1e",
              "queryType":"QueryByExample",
              "reason":"Showing a valid traveller",
              "required": true,
              "schemaId":"sch:hid:testnet:zEDKz5dii18skPoPShVjzkAiZ5fE6t6hJ3DXnaUtJ3Q73:1.0"
      }
  ```

#### Delete presentation template

- **URL**
  ```js
    DELETE https://stage.hypermine.in/studioserver/api/v1/presentations/template/${templateId}
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Response Body**
  ```js
      {
        Template has deleted successfully
      }
  ```

#### Create Presentation Request

This api is to create presentation request for short period of time.

- **URL**
  ```js
     POST https://stage.hypermine.in/studioserver/api/v1/presentation/request
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Request Body**
  `js { "challenge":"bf0d10d5-0d8c-40dc-926b-48f3139a7b08",// optional "did":"did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL", "templateId":"340da246-a9ad-49bb-bc5a-363cbbed80d6" } ` -**Reseponse Body**
  ```js
  {
   "id": "70ade2bc-5a55-4f7d-be58-1bf7ba1b4540",
   "callbackUrl": "https://localhost:4000",
   "request": {
       "id": "70ade2bc-5a55-4f7d-be58-1bf7ba1b4540",
       "type": "https://stage.hypermine.in/studionserver/verifiable-presentation/request/QueryByExample",
       "from": "did:key:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
       "created_time": 1670425914623,
       "expires_time": 1670426214619,
       "body": {
                   "type": "QueryByExample",
                   "reason":"Showing a valid traveller",
                   "required": true,
                   "domain": "hyperfyre-stage.netlify.app/",
                    "challenge": "bf0d10d5-0d8c-40dc-926b-48f3139a7b08"
                }
          }
      }
  ```

#### Verify Presentation

This api verify particular presentation.

- **URL**
  ```js
  POST https://stage.hypermine.in/studioserver/api/v1/presentation/verify
  ```
- **Request Header**
  ```js
    Authorization: ${access_token},
    Accept: application/json
  ```
- **Request Body**
  ```js
  {
  "verifiablePresentation":{
    "verifiableCredential":[
  "@context": ["https://www.w3.org/2018/credentials/v1", {
      "hs": "https://jagrat.hypersign.id/rest/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zGbvNLYRxVw3LiYEWtS8Womjv8QayTsHqWqnEEXwEEa1n:1.0:"
  }, {
      "PNR number": "hs:PNR number"
  }, {
      "arrival date": "hs:arrival date"
  },  {
      "destination": "hs:destination"
  }
  "https://w3id.org/security/suites/ed25519-2020/v1"],
  "id": "vc:hid:testnet:z3bp6DPNMp5ZcdgDNdHmyboKgJ7YYEEwrKaPmTm4SHjbs",
  "type": ["VerifiableCredential", "Air Ticket schema"],
  "expirationDate": "2022-11-14T22:47:00Z",
  "issuanceDate": "2022-11-07T10:48:47Z",
  "issuer": "did:hid:devnet:z6MkrZwahvcvUGjQGKC1hJeXZ16pGgnUiQsAZTPdcwDFZKhL",
  "credentialSubject": {
      "PNR number": "1367475",
          "arrival date": "12/10/22",
          "destination": "patna",
      "id": "did:hid:testnet:z4j9Exyg3Cbkq9AsMRJVSkW3q7nTriyv25WTp3rQaCLjR"
  },
  "credentialSchema": {
      "id": "sch:hid:testnet:zGbvNLYRxVw3LiYEWtS8Womjv8QayTsHqWqnEEXwEEa1n:1.0",
      "type": "JsonSchemaValidator2018"
  },
  "credentialStatus": {
      "id": "https://jagrat.hypersign.id/rest/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z3bp6DPNMp5ZcdgDNdHmyboKgJ7YYEEwrKaPmTm4SHjbs",
      "type": "CredentialStatusList2017"
  },
  "proof": {
      "type": "Ed25519Signature2020",
      "created": "2022-11-07T10:50:34Z",
      "verificationMethod": "did:hid:testnet:z4j9Exyg3Cbkq9AsMRJVSkW3q7nTriyv25WTp3rQaCLjR#key-1",
      "proofPurpose": "assertionMethod",
      "proofValue": "z3sN94D6a5RQBZbwRBhFLvRtsXwvT4926y9fDwrL8svWFaJ7T5Zpb78Z1kaDkQNakzgZvrYsUjds2GbL99avJUW2E"
    }
   ]
  }
  "challenge": "bf0d10d5-0d8c-40dc-926b-48f3139a7b08",
  }
  ```
- **Response Body**
  ```js
    {
     "verified": true
    }
  ```
