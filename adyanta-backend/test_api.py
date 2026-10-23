
import json
import urllib.request
import urllib.error

base = "http://127.0.0.1:5000"

def call_api(path, method="GET", data=None, token=None):
    headers = {}
    body = None

    if data is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode()

    if token:
        headers["Authorization"] = "Bearer " + token

    req = urllib.request.Request(
        base + path,
        data=body,
        headers=headers,
        method=method
    )

    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as error:
        return json.loads(error.read())


registration = call_api("/api/register", "POST", {
    "fullname": "Test User",
    "email": "test@example.com",
    "password": "DemoPass123!"
})
print("REGISTER:", registration)

result = call_api("/api/login", "POST", {
    "email": "test@example.com",
    "password": "DemoPass123!"
})
print("LOGIN:", result)

token = result.get("token")

if token:
    print("PROFILE:", call_api("/api/profile", token=token))
    print("LOGOUT:", call_api("/api/logout", "POST", token=token))
