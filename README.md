# Final Assessment - Order Management System

This project is a full-stack Order Management System consisting of a **React frontend** and a **.NET backend**. It enables creating, viewing, and editing customer orders that include employee assignments, products, and validated shipping addresses.

DEMO: https://youtu.be/eI-94kTAxaY

---

## 🧰 Backend (.NET 9 Web API)

### Project Structure

```
/backend
├── Controllers
│   └── OrdersController.cs
├── DTOs
│   └── OrderDto.cs, CustomerDto.cs, etc.
├── Models
│   └── Order.cs, Customer.cs, Employee.cs, Product.cs
├── Data
│   └── AppDbContext.cs
├── Services
│   ├── Interfaces
│   │   └── IOrderService.cs
│   └── Implementations
│       └── OrderService.cs
└── Program.cs
```

### Key Features

- RESTful endpoints to manage orders.
- DTOs for decoupling API surface from entities.
- Services with clean separation of concerns.
- Entity Framework Core to persist data.

---

## 🌐 Frontend (React + Tailwind CSS)

### Directory Structure

```
/frontend
├── components
│   ├── OrderActions.jsx        // New, Save, Previous, Next buttons
│   ├── OrderDetailsList.jsx    // Line items with product selection and prices
│   ├── OrderInfo.jsx           // Customer, employee, date, and address
│   └── OrderMap.jsx            // Shows validated address with Google Maps
├── hooks2
│   ├── useAddress.js
│   ├── useOrderCrud.js
│   ├── useOrderData.js
│   ├── useOrderOptions.js
│   └── useOrderState.js
├── pages
│   └── OrderManagement.jsx
├── App.jsx
└── main.jsx
```

### Key Features

- Calls backend API to load and save orders.
- Form inputs for customer, employee, products, and address.
- Google Maps API integration for validating and displaying addresses.
- Custom hooks split responsibilities (state vs. persistence vs. validation).
- Order form auto-populates when loading an existing order.

---

## 🔄 Frontend-Backend Interaction

When the user loads the UI:

- The frontend calls `/api/orders/{id}` to fetch order data.
- If `New` is pressed, an empty form is shown.
- On `Save`, the frontend POSTs or PUTs the order JSON.

---

## 📦 JSON Structure

### Received from Backend (GET `/api/orders/{id}`)

```json
{
  "id": 1,
  "orderDate": "2025-05-03",
  "customer": {
    "id": 3,
    "contactName": "Maria Anders"
  },
  "employee": {
    "id": 5,
    "fullName": "Steven Buchanan"
  },
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "USA",
    "lat": 34.0522,
    "lng": -118.2437
  },
  "details": [
    {
      "productId": 2,
      "productName": "Chai",
      "unitPrice": 18.0,
      "quantity": 5
    }
  ]
}
```

### Sent to Backend (POST or PUT `/api/orders`)

```json
{
  "customerId": "ALFKI",
  "employeeId": 5,
  "orderDate": "2025-05-03",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "USA",
    "lat": 34.0522,
    "lng": -118.2437
  },
  "details": [
    {
      "productId": 2,
      "unitPrice": 18.0,
      "quantity": 5
    }
  ]
}
```

---

## ✅ Address Validation Flow

- Users type or pick an address.
- `useAddressValidation` uses Google Geocoding API to validate.
- Required fields: street, city, state, postal code, country.
- Once valid, a green checkmark appears and map is rendered.

---

## 🚀 Tech Stack

- **Frontend:** React, Tailwind CSS, Google Maps JavaScript API
- **Backend:** ASP.NET Core Web API, Entity Framework Core
- **Database:** SQL Server (code-first migrations supported)

---

Feel free to contribute or raise issues. Happy coding!

---

✨ *Created as part of Final Assessment*
