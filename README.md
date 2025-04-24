# FleetPro - ✨ 📊Real-Time 🚗Fleet Management System 🚀

**FleetPro** is a modern Real-Time Fleet Management System which allows user to track their vehicles for an assigned Trip and provides an Optimized. It generates Alert messages for the Vehicle's Inactivity, Route Deviation & Maintenance. It allows managing the vehicles, Assigning Optimized Routes to the Vehicles using Google Maps Distance API, Changes the status of the vehicle based on the movement. It maintains the location History for the vehicles on the routes.

## 🌟 Features

### 🚴🏻‍♂️ Driver Features
- 🚗 Can Drive the Vehicle based on the Assigned Route.
- ⭐ Can stop the Vehicle while driving & can Resume their Driving.
  
### 👨🏻‍💼 Manager Features
- 🛣️ Can Track the Vehicle's Route & Movement in Real⌚Time.
- ⚠️ Receives Alert messages for the vehicle's Route Deviation, Inactivity & Maintenance.
- 
### 🛠️ Admin Features
- 🛣️ Assignes Routes to the Vehicles.
- 📈 Real-Time Tracking of the Vehicle.
- ➕ Create and add 🚗 New Vehicles.
- ✏️ Edit Vehicles details.
- 🚮 Deactivate the vehicles.
- 📍 Track the Location History of the Vehicle on the Route.

## 🛠️ Tech Stack

### 🎨 Frontend
- **Vue 3 + Composition API** - Reactive UI Framework
- **Pinia** - Store management
- **Axios** - HTTP client
- **Vite** - Fast bundler & dev server
- **Google Maps** - Map rendering for routes

### 🚀 Backend
- **Fastify** - High-performance Node.js web framework
- **TypeORM** - ORM for database operations
- **PostgreSQL** - Relational database
- **WebSockets** - Real-time bi-directional communication
- **TypeScript** - Typed JavaScript
- **JWT** - Secure authentication
- **Class Validator** - Validation for request bodies

## Setup Instructions
 
### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
 
### Backend Setup
 
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
 
2. Install dependencies:
   ```bash
   npm install
   ```
 
3. Create a `.env` file in the backend directory with the following variables:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=fleetManagement
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1h
   ```
 
4. Start the development server:
   ```bash
   npm run dev
   ```
 
5. The backend API will be available at http://localhost:8000
 
 
### Frontend Setup
 
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Real-Time-Fleet-Management.git
   cd Real-Time-Fleet-Management/frontend
   
2. **Install the dependencies**:
   ```bash
   npm install

3. **Run the Angular Application**
   ```bash
   npm run dev
 
## API Documentation
 
The complete API documentation is available on Postman:
[Fleet Pro API Documentation](https://documenter.getpostman.com/view/26606017/2sB2izCCVk)
 
 
# 📽️ Fleet Pro - Demo Video  
 
Watch the demo of the **Fleet-Pro**:  
🔗 **FleetPro : [Click here to watch the demo](https://www.awesomescreenshot.com/video/39101971?key=82b3677a4bbf07757db6f240c401784e)**  
