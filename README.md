# CivicTrack 🏛️📍

> **Empowering Communities, Fixing Cities**  
> A modern, responsive citizen reporting & public civic issue resolution platform.

CivicTrack enables residents to report local municipal issues—such as potholes, overflowing garbage dumpsters, water leaks, broken streetlights, and drainage blockages—with automatic GPS geotagging, photo evidence, public interactive mapping, status progression tracking, community upvoting, comments, and municipal authority administration.

---

## ✨ Features Overview

### 1. 📸 Photo Upload & Automatic GPS Geotagging
- **Camera & File Upload**: Residents can upload photos of civic issues or use 1-click test presets (Pothole, Waste, Water burst, Broken streetlight, Drainage).
- **Automatic Geotagging**: Captures exact Latitude and Longitude using browser `navigator.geolocation` or manual map placement.
- **Interactive Mini-Map Pin**: Allows users to drag or click on the map to pin-point the precise location.
- **Landmarks & Ward Selection**: Categorizes complaints into municipal wards and landmarks.

### 2. 🗺️ Interactive Public Map
- **Leaflet & OpenStreetMap**: Custom SVG pins color-coded by issue status and category icons.
- **Emergency Pulsing Rings**: Visually highlights Critical and High Urgency safety hazards.
- **Interactive Popups**: View photo thumbnails, category badges, upvotes, and jump straight into full complaint details.
- **Map Controls**: Real-time filters by category and status, "Find Near Me" button, and map center resets.

### 3. 📋 Public Dashboard & Tracking
- **Lifecycle Status Stepper**:
  - `Submitted` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`
- **Before & After Resolution Proof**: Displays side-by-side or tabbed photos proving the problem was resolved by the field crew.
- **Community Upvoting & Discussion**: Upvote urgent issues to prioritize them; leave comments with official responses highlighted by gold authority badges.
- **Search & Filters**: Instant multi-keyword search, category chips, status tabs, ward filtering, and sorting (Newest, Most Upvoted, Highest Severity, Most Discussed).

### 4. 🛡️ Municipal Authority (Admin) Operations
- **Instant Role Switcher**: Toggle between **Resident Mode** and **Municipal Authority (Admin) Mode** in the header.
- **Workflow Management**: Update complaint status (`Submitted` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`).
- **Department Routing**: Assign tickets to Public Works & Roads, Solid Waste, Water & Sewerage, Electricity, Parks, or Traffic Safety.
- **Official Notes & Resolution Proof**: Add municipal remarks and attach resolution proof photos (with celebratory confetti upon resolution).

### 5. 📊 Public Transparency & Accountability Scoreboard
- **Municipal Metrics**: Overall resolution rate %, average resolution turnaround time, total reported issues.
- **Category Breakdown Chart**: Visual distribution across civic hazards.
- **Resolution Pipeline Funnel**: Active counts in each phase.
- **Ward-by-Ward Scorecard**: Ranks municipal wards based on responsiveness and resolution success.
- **Open Civic Data Export**: 1-click download of all complaints as a CSV file.

### 6. 🔔 Real-Time Notifications
- In-app notification center that alerts residents when a complaint status changes, an officer leaves an update, or community members upvote/comment.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Running

```bash
# Clone or navigate to the project directory
cd civictrack

# Install dependencies (already completed)
npm install

# Start development server
npm run dev
```

The application is running at:
👉 **[http://localhost:3000](http://localhost:3000)**

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🛠️ Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS with custom civic color palettes and responsive typography
- **Map Engine**: Leaflet with OpenStreetMap & CartoDB Voyager tiles
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Storage**: LocalStorage with automatic synchronization and mock initial data
