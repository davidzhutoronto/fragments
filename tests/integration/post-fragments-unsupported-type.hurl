# 3. post-fragments-unsupported-type.hurl
# Confirm that posting an unsupported Content-Type produces a 415 error
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a plain text fragment
Content-Type: image/svg+xml
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 415
HTTP/1.1 415
