# 2. Auth Flows - Registration & Login

This page demonstrates registration and login on **both** the web app (http://localhost:3000) and the mobile app (Expo Go). Make sure [docker-compose is running](01-environment-setup.md) before testing.

Both clients send requests to the same endpoints and enforce the **same validation rules** (see [web-server/src/controllers/userController.js](../web-server/src/controllers/userController.js)):

- **Username, name, phone, email, password** are required for everyone.
- **Regular users** additionally require an **address** and a **profile image**.
- **Restaurant owners** do not need an address/image - they manage restaurants instead.
- **Password**: at least 8 characters, containing at least one letter and one digit.
- **Phone**: digits only.
- **Email**: must contain `@` and a domain (e.g. `name@example.com`).

---

## 2.1 Registration - Web

**1.** From the landing page, click **Sign up / Register** and choose **Restaurant Owner**, then fill in the form:

<img width="958" height="443" alt="Restaurant owner registration" src="https://github.com/user-attachments/assets/93ceb087-544e-478d-ad8c-09669a65206b" />

**2.** Registering as a **Regular User** is the same form, with the extra address/image fields and a photo picker:

<img width="220" height="437" alt="Regular user registration" src="https://github.com/user-attachments/assets/08cb4fd3-07a1-4804-b101-dbcb49d0c604" />

---

## 2.2 Registration - Mobile

**1.** From the login screen, tap **Sign up**. Use the **Regular User / Restaurant Owner** switch at the bottom of the form to pick the account type; for a regular user, tap **Choose Photo** to pick a profile image.

<img width="260" height="563" alt="Mobile registration form" src="https://github.com/user-attachments/assets/73534730-e813-4112-a67a-0ac0802bd9f3" />

**2.** Fill in the rest and tap **Create Account**. On success, the app shows *"Registration successful! Redirecting to login..."* and navigates to the login screen automatically.

<img width="260" height="563" alt="Mobile registration success" src="https://github.com/user-attachments/assets/ed7d186f-b250-4bbf-9261-f410590fa2dd" />

---

## 2.3 Login - Web

**1.** Enter the username and password from registration and submit:

<img width="804" height="386" alt="Login / authentication page" src="https://github.com/user-attachments/assets/85080878-e72f-49d1-ab7c-890c0bdc460a" />

---

## 2.4 Login - Mobile

**1.** Here we log in successfully on mobile:

<img width="260" height="563" alt="Mobile login success" src="https://github.com/user-attachments/assets/6c636ed1-87af-495d-a2be-9720c8afe7ea" />

---

## 2.5 Notes

- Both clients use the same JWT-based login (`POST /api/tokens`); the token is stored client-side (in browser/app state) and sent as `Authorization: Bearer <token>` on subsequent requests.
- A user created on the web can log in on mobile (and vice versa) - they're the same account in the same shared MongoDB database.

---

**Next:** [03-crud-flows.md](03-crud-flows.md) - restaurants, products and orders.
