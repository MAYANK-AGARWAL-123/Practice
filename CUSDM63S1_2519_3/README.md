# Express.js Basic Server

A simple Express.js server with basic routing.

## Setup Instructions

1. Clone this repository or create a new Node.js project
2. Install dependencies:
   ```bash
   npm init -y
   npm install express
   ```
3. Create `server.js` with the provided code
4. Start the server:
   ```bash
   node server.js
   ```

## Available Routes

- `GET /home` - Returns HTML welcome message
- `GET /aboutus` - Returns JSON welcome message
- `GET /contactus` - Returns dummy contact details
- Any other route - Returns 404 Not Found

## Testing

You can test the endpoints using:

1. Web browser:
   - Visit `http://localhost:3000/home`
   - Visit `http://localhost:3000/aboutus`
   - Visit `http://localhost:3000/contactus`
   - Visit any other route to see 404 response

2. Postman:
   - Send GET requests to the above endpoints
   - Check response status codes and content

## Response Examples

- `/home`:
  ```html
  <h1>Welcome to Home Page</h1>
  ```

- `/aboutus`:
  ```json
  {
    "message": "Welcome to About Us"
  }
  ```

- `/contactus`:
  ```json
  {
    "email": "contact@example.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Main St, City, Country"
  }
  ```

- Undefined routes:
  ```
  404 Not Found
  ```