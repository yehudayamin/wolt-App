# 3. CRUD Flows - Restaurants, Products & Orders

This page demonstrates the main create/edit/delete flows on **both** the web app and the mobile app. Make sure [docker-compose is running](01-environment-setup.md) and you're [logged in](02-auth-flows.md) before testing.

- **Restaurants** can only be created/edited/deleted by users registered as a **restaurant owner**, and only by the **owner** of that specific restaurant.
- **Products** (menu items) can only be added/edited/deleted by the owner of the restaurant they belong to.
- **Orders** can be placed by **regular users**, and their status can be updated to `pending` / `completed` / `cancelled`.

---

## 3.1 Restaurant - Create, Edit, Delete

### Web

**1.** After logging in as a restaurant owner, click **"Add Restaurant"** on the main page:

<img width="959" height="422" alt="Main page with Add Restaurant button" src="https://github.com/user-attachments/assets/0d7f741c-ef46-4497-b349-8ee56ef04d55" />

**2.** Fill in the form (name, address, phone, description, categories). Latitude/longitude default to Tel Aviv and can be changed:

<img width="271" height="415" alt="Add restaurant form" src="https://github.com/user-attachments/assets/1f438b56-822f-46d0-b540-7c68ddf7e763" />

**3.** The new restaurant appears on the main page immediately:

<img width="866" height="424" alt="Newly created restaurant on the main page" src="https://github.com/user-attachments/assets/0ae0297d-b6c8-4f25-bd79-054c95a69cf7" />

**4.** Opening the restaurant page as its owner shows **Edit** and **Delete** buttons:

<img width="1902" height="817" alt="Web: restaurant page with Edit/Delete buttons" src="https://github.com/user-attachments/assets/12cd2426-e366-4463-8309-f123a38ed9f9" />

### Mobile

The same flow exists on mobile: a restaurant owner sees a **"+ Add Restaurant"** button on the Home tab, and **Edit**/**Delete** buttons on a restaurant's own page.

<img width="260" height="563" alt="Mobile: Add Restaurant form" src="https://github.com/user-attachments/assets/0d5ff631-a2ee-40ee-9b02-f943b7ec299b" />

<img width="260" height="563" alt="Mobile: restaurant page with Edit/Delete buttons" src="https://github.com/user-attachments/assets/b7639474-2d70-406f-a000-8ed833b68c0a" />

---

## 3.2 Product (Menu Item) - Create, Edit, Delete

### Web

**1.** On a restaurant page you own, click **"Add Product"**:

<img width="959" height="428" alt="Add product button" src="https://github.com/user-attachments/assets/c793e30f-0c34-42d8-9bde-2110bdfb39f4" />

**2.** Fill in name, description, price, and category:

<img width="958" height="422" alt="Add product form" src="https://github.com/user-attachments/assets/7b62e4d8-0d75-445f-a0e9-f3232bb1bf26" />

**3.** The product appears in the restaurant's menu:

<img width="958" height="430" alt="Product shown on the restaurant page" src="https://github.com/user-attachments/assets/97ce5c43-c770-43f3-96c6-a78fadfb91b4" />

**4.** As the owner, each product card has **Edit** and **Delete** controls:

<img width="1518" height="736" alt="Web: product Edit/Delete controls" src="https://github.com/user-attachments/assets/3961ed95-279c-4a44-9871-7a713fa5d4e3" />

### Mobile

Same flow: **"+ Add Product"** button on the restaurant page (owner only), with Edit/Delete on each product card.

<img width="260" height="563" alt="Mobile: Add Product form" src="https://github.com/user-attachments/assets/818815f1-d59d-40f3-8b6b-6c2c834825ac" />

<img width="260" height="563" alt="Mobile: product Edit/Delete controls" src="https://github.com/user-attachments/assets/c4dad989-433f-46fa-9d92-8732ad0b9ed9" />

---

## 3.3 Order - Add to Cart, Place Order, My Orders, Status

### Web

**1.** Log in as a regular user, open a restaurant, add products to the cart, then click **"Place Order"**. The order total is calculated automatically from the product prices on the server:

<img width="959" height="440" alt="Restaurant page and placing an order" src="https://github.com/user-attachments/assets/a312c307-2e37-45f0-a894-1fdf860bad7d" />

**2.** Click **"My Orders"** to see your order list with its current status (defaults to `pending`):

<img width="957" height="439" alt="My Orders page" src="https://github.com/user-attachments/assets/9cdb022a-4710-45f8-b0d1-e3dbdc161a72" />

**3.** Change the order's status using the status selector (`pending` / `completed` / `cancelled`):

<img width="1913" height="515" alt="Web: changing order status" src="https://github.com/user-attachments/assets/5b534f2a-c5f2-4f35-ac29-bca3bfb39207" />

### Mobile

**1.** On a restaurant page, tap a product to add it to the cart, then tap **"Place Order"**:

<img width="260" height="563" alt="Mobile: cart and Place Order button" src="https://github.com/user-attachments/assets/f7b2a6e5-190a-4619-a960-4ac7d985ec8e" />

**2.** Open the **Orders** tab to see **My Orders**:

<img width="260" height="563" alt="Mobile: My Orders tab" src="https://github.com/user-attachments/assets/684fbe4c-a70f-4e92-b415-fdfc9f4397eb" />

**3.** Tap a status chip (`pending` / `completed` / `cancelled`) on an order card to update it:

<img width="260" height="563" alt="Mobile: changing order status" src="https://github.com/user-attachments/assets/45f6c8ed-cf7d-4e7b-a9b0-a98df2938eeb" />

---

## 3.4 Notes

- All restaurant/product/order endpoints require a valid JWT (`Authorization: Bearer <token>`); ownership checks happen server-side, so the **Edit/Delete** buttons only ever appear for the actual owner in both UIs.
- The total price of an order is always computed server-side from the restaurant's current product prices - it cannot be tampered with from the client.
- The web app and the mobile app are independent clients of the same `web-server` API and the same MongoDB database - anything created or changed on one is immediately visible on the other.
