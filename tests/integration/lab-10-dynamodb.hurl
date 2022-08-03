# tests/integration/lab-10-dynamodb.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a plain text fragment
Content-Type: application/json
# Body of the request
{"name": "David", "school": "Seneca"}
# We expect to get back an HTTP 201
HTTP/1.1 201
# Capture the Location URL into a variable named `fragment1_url` 
# and id in `fragment1_id`
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# GET the fragment info (i.e., metadata) for the fragment you just created
# using the Location URL/info as an authorized user and 
# confirm that the server returns a 200 and that all of the metadata properties match what you expect.
GET {{fragment1_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Type: application/json; charset=utf-8

[Asserts]
jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
# 19 is the length of our fragment data: '{"name": "David", "school": "Seneca"}'
jsonpath "$.fragment.size" == 37

# POST a second Markdown fragment Markdown value, `DynamoDB is **great**.`.
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/markdown
```DynamoDB is **great**.```
HTTP/1.1 201
# Capture the Location URL into a variable named `fragment2_url` 
# and id in `fragment2_id`
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# GET the fragment info (i.e., metadata) for the fragment you just created
# using the Location URL/info as an authorized user and 
# confirm that the server returns a 200 and that all of the metadata properties match what you expect.
GET {{fragment2_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 22

# GET all of the fragments for the same authorized user without expanding them (i.e., just get back the IDs) 
# and confirm that the list of fragments includes the two id values you captured above
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
body contains "{{fragment1_id}}"
body contains "{{fragment2_id}}"

DELETE {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200


# Try to GET the first fragment again using the url you captured above as the authorized user.
# Confirm that the server returns a 404, since the fragment should be deleted.
GET {{fragment1_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 404
Content-Type: application/json; charset=utf-8


# GET all of the fragments for the same authorized user without expanding them (i.e., just get back the IDs) 
# and confirm that the list of fragments includes the two id values you captured above
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
body not contains "{{fragment1_id}}"
body contains "{{fragment2_id}}"
