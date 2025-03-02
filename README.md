
## Sign-Up API Documentation

### Path to Sign Up:
The sign-up endpoint is available at:

```
/signup
```

### File containing the logic:
The logic for handling the sign-up is written in:

```
/routes/signup
```

### Required Fields for User Onboarding:

#### **Mandatory Fields:**

To successfully onboard a user, the following fields must be provided in the request body:

```json
{
  "fullName": "John Doe",
  "mobileNumber": "9876543210",
  "email": "john.doe@example.com",
  "password": "Password123@"
}
```

- `fullName`: The full name of the user (min. 3 characters)
- `mobileNumber`: The user’s mobile number (must be exactly 10 digits)
- `email`: A valid email address
- `password`: A password that must meet the following criteria:
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one numeric digit
  - At least one special character (e.g., `@`, `#`, etc.)
  - Minimum length of 6 characters

#### **Optional Fields:**

- **Profile Picture** (Optional):
  - If the user wishes to upload a profile picture, they can include it in the request as a file under the field name `profilePicture`.







