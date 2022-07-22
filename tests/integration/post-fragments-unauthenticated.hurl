# 5. post-fragments-unauthenticated.hurl
# Confirm that posting a fragment when not authenticated produces a 401 error
POST http://localhost:8080/v1/fragments
# wrong password
Authorization: Basic wrongpassword==
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 401
HTTP/1.1 401
