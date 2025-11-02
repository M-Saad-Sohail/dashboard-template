# Complete Project Documentation

> **Comprehensive documentation covering every aspect of this Next.js Admin Dashboard Template**

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Architecture](#project-architecture)
4. [Complete File Structure](#complete-file-structure)
5. [Pages](#pages)
6. [Layouts](#layouts)
7. [Components](#components)
8. [State Management (Redux)](#state-management-redux)
9. [Context Providers](#context-providers)
10. [Middleware](#middleware)
11. [Hooks](#hooks)
12. [Icons System](#icons-system)
13. [Styling System](#styling-system)
14. [How Everything Connects](#how-everything-connects)
15. [Development Guide](#development-guide)

---

## Project Overview

### What is This Project?

This is a **production-ready Next.js 15 Admin Dashboard Template** built with modern web technologies. It's designed for building admin panels, dashboards, CMS, and enterprise applications with a focus on:

- 🎨 Beautiful, modern UI with dark mode support
- 🔐 Built-in authentication flow (ready for API integration)
- 📊 Data visualization components (charts, tables, maps)
- 🎯 Type-safe with TypeScript
- 🚀 Optimized performance with Next.js 15
- 📱 Fully responsive design
- ♿ Accessible components
- 🔄 Redux state management with persistence
- 🎭 Multiple layout options

### Key Features

1. **Authentication System**
   - Sign In / Sign Up pages
   - Protected routes with middleware
   - Redux-managed auth state
   - Cookie-based session (ready for backend)

2. **Dashboard Components**
   - Ecommerce metrics
   - Charts (Line, Bar)
   - Tables with pagination
   - User profile management
   - Calendar integration
   - Map visualization

3. **UI Component Library**
   - 50+ pre-built components
   - Alerts, Badges, Buttons
   - Modals, Dropdowns
   - Forms with validation
   - File uploads
   - Image galleries
   - Video players

4. **Developer Experience**
   - TypeScript throughout
   - ESLint configuration
   - Hot module replacement
   - Type-safe Redux hooks
   - Reusable contexts

---

## Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.2.3 | React framework with SSR, routing, and optimization |
| **React** | 19.0.0 | UI library for building components |
| **TypeScript** | 5.x | Type safety and better developer experience |
| **Tailwind CSS** | 4.0.0 | Utility-first CSS framework |

### State Management

| Library | Version | Purpose |
|---------|---------|---------|
| **Redux Toolkit** | 2.9.2 | Modern Redux with less boilerplate |
| **React Redux** | 9.2.0 | React bindings for Redux |
| **Redux Persist** | 6.0.0 | Persist Redux state to localStorage |

### UI & Visualization

| Library | Version | Purpose |
|---------|---------|---------|
| **ApexCharts** | 4.3.0 | Interactive charts |
| **React ApexCharts** | 1.7.0 | React wrapper for ApexCharts |
| **FullCalendar** | 6.1.15 | Calendar component |
| **React JVectorMap** | 1.0.4 | Interactive maps |
| **Swiper** | 11.2.0 | Modern mobile touch slider |

### Forms & Interactions

| Library | Version | Purpose |
|---------|---------|---------|
| **React Dropzone** | 14.3.5 | File upload with drag & drop |
| **React DnD** | 16.0.1 | Drag and drop functionality |
| **Flatpickr** | 4.6.13 | Date/time picker |
| **Tailwind Forms** | 0.5.9 | Better form styling |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9.x | Code linting |
| **PostCSS** | 8.x | CSS processing |
| **Autoprefixer** | 10.4.20 | Add vendor prefixes |
| **SVGR Webpack** | 8.1.0 | Import SVGs as React components |

---

## Project Architecture

### Design Patterns Used

1. **Route Groups** - Next.js 13+ feature for organizing routes without affecting URL structure
   - `(auth)` - Authentication pages
   - `(dashboard)` - Dashboard pages
   
2. **Component-Based Architecture** - Everything is a reusable component
   
3. **Context API** - For global state that doesn't need Redux (theme, sidebar)
   
4. **Redux for Complex State** - Authentication, user data, app-wide state
   
5. **Middleware Pattern** - Route protection and authentication checks
   
6. **Provider Pattern** - Wrapping app with various providers (Redux, Theme, Sidebar)

### Application Flow

```
User Visits Site
     ↓
middleware.ts (checks auth)
     ↓
Root Layout (layout.tsx)
     ├── Redux Provider
     ├── Theme Provider
     └── Sidebar Provider
          ↓
     Route-specific Layout
          ├── (auth)/auth/layout.tsx - For auth pages
          └── (dashboard)/dashboard/layout.tsx - For dashboard
               ↓
          Page Component
               ├── Uses hooks (useAppSelector, useAppDispatch)
               ├── Fetches data
               └── Renders UI components
```

---

## Complete File Structure

```
free-nextjs-admin-dashboard-main/
│
├── public/                          # Static assets
│   └── images/                      # Images organized by type
│       ├── brand/                   # Brand logos (brand-01 to brand-15)
│       ├── cards/                   # Card images
│       ├── carousel/                # Carousel images
│       ├── chat/                    # Chat avatars
│       ├── country/                 # Country flags (SVG)
│       ├── error/                   # Error page illustrations
│       ├── grid-image/              # Grid layout images
│       ├── icons/                   # File type icons
│       ├── logo/                    # App logos (light/dark/auth)
│       ├── product/                 # Product images
│       ├── task/                    # Task icons
│       ├── user/                    # User avatars (38 images)
│       └── video-thumb/             # Video thumbnails
│
├── src/
│   ├── _core/                       # Core application logic
│   │   ├── features/                # Redux slices
│   │   │   └── authSlice.ts         # Authentication state management
│   │   ├── providers/               # React providers
│   │   │   └── ReduxProvider.tsx    # Redux Provider with persistence
│   │   ├── reducer/                 # Redux reducers
│   │   │   └── rootReducer.ts       # Combines all reducers + persistence config
│   │   └── store/                   # Redux store
│   │       └── store.ts             # Store configuration
│   │
│   ├── app/                         # Next.js 13+ app directory
│   │   ├── (auth)/                  # Route group for auth (doesn't affect URL)
│   │   │   └── auth/                # Actual 'auth' path
│   │   │       ├── layout.tsx       # Layout for auth pages (no sidebar)
│   │   │       ├── signin/
│   │   │       │   └── page.tsx     # Sign in page → /auth/signin
│   │   │       └── signup/
│   │   │           └── page.tsx     # Sign up page → /auth/signup
│   │   │
│   │   ├── (dashboard)/             # Route group for dashboard
│   │   │   └── dashboard/           # Actual 'dashboard' path
│   │   │       ├── (others-pages)/  # Nested route group
│   │   │       │   └── profile/
│   │   │       │       └── page.tsx # Profile page → /dashboard/profile
│   │   │       ├── layout.tsx       # Layout with sidebar + header
│   │   │       └── page.tsx         # Main dashboard → /dashboard
│   │   │
│   │   ├── layout.tsx               # Root layout (wraps everything)
│   │   ├── page.tsx                 # Root page (redirects to /dashboard)
│   │   ├── not-found.tsx            # 404 page
│   │   ├── globals.css              # Global styles
│   │   └── favicon.ico              # App favicon
│   │
│   ├── components/                  # React components (organized by feature)
│   │   │
│   │   ├── auth/                    # Authentication components
│   │   │   ├── SignInForm.tsx       # Complete sign-in form
│   │   │   └── SignUpForm.tsx       # Complete sign-up form
│   │   │
│   │   ├── calendar/                # Calendar components
│   │   │   └── Calendar.tsx         # FullCalendar integration
│   │   │
│   │   ├── charts/                  # Chart components
│   │   │   ├── bar/
│   │   │   │   └── BarChartOne.tsx  # Bar chart with ApexCharts
│   │   │   └── line/
│   │   │       └── LineChartOne.tsx # Line chart with ApexCharts
│   │   │
│   │   ├── common/                  # Shared/common components
│   │   │   ├── ChartTab.tsx         # Tab switcher for charts
│   │   │   ├── ComponentCard.tsx    # Card wrapper for components
│   │   │   ├── GridShape.tsx        # Decorative grid background
│   │   │   ├── PageBreadCrumb.tsx   # Breadcrumb navigation
│   │   │   ├── ThemeToggleButton.tsx # Theme switcher button
│   │   │   └── ThemeTogglerTwo.tsx  # Alternative theme toggler
│   │   │
│   │   ├── ecommerce/               # E-commerce dashboard widgets
│   │   │   ├── CountryMap.tsx       # World map with stats
│   │   │   ├── DemographicCard.tsx  # User demographics chart
│   │   │   ├── EcommerceMetrics.tsx # Key metrics cards
│   │   │   ├── MonthlySalesChart.tsx # Monthly sales visualization
│   │   │   ├── MonthlyTarget.tsx    # Target vs actual chart
│   │   │   ├── RecentOrders.tsx     # Recent orders table
│   │   │   └── StatisticsChart.tsx  # Statistics overview
│   │   │
│   │   ├── example/                 # Example implementations
│   │   │   └── ModalExample/        # Modal usage examples
│   │   │       ├── DefaultModal.tsx
│   │   │       ├── FormInModal.tsx
│   │   │       ├── FullScreenModal.tsx
│   │   │       ├── ModalBasedAlerts.tsx
│   │   │       └── VerticallyCenteredModal.tsx
│   │   │
│   │   ├── form/                    # Form components
│   │   │   ├── form-elements/       # Complete form examples
│   │   │   │   ├── CheckboxComponents.tsx
│   │   │   │   ├── DefaultInputs.tsx
│   │   │   │   ├── DropZone.tsx     # File upload zone
│   │   │   │   ├── FileInputExample.tsx
│   │   │   │   ├── InputGroup.tsx
│   │   │   │   ├── InputStates.tsx
│   │   │   │   ├── RadioButtons.tsx
│   │   │   │   ├── SelectInputs.tsx
│   │   │   │   ├── TextAreaInput.tsx
│   │   │   │   └── ToggleSwitch.tsx
│   │   │   │
│   │   │   ├── group-input/         # Specialized inputs
│   │   │   │   └── PhoneInput.tsx   # Phone number input
│   │   │   │
│   │   │   ├── input/               # Base input components
│   │   │   │   ├── Checkbox.tsx     # Checkbox component
│   │   │   │   ├── FileInput.tsx    # File input
│   │   │   │   ├── InputField.tsx   # Text input
│   │   │   │   ├── Radio.tsx        # Radio button
│   │   │   │   ├── RadioSm.tsx      # Small radio
│   │   │   │   └── TextArea.tsx     # Text area
│   │   │   │
│   │   │   ├── switch/              # Switch components
│   │   │   │   └── Switch.tsx       # Toggle switch
│   │   │   │
│   │   │   ├── date-picker.tsx      # Date picker component
│   │   │   ├── Form.tsx             # Form wrapper
│   │   │   ├── Label.tsx            # Form label
│   │   │   ├── MultiSelect.tsx      # Multi-select dropdown
│   │   │   └── Select.tsx           # Select dropdown
│   │   │
│   │   ├── header/                  # Header components
│   │   │   ├── NotificationDropdown.tsx # Notification bell + dropdown
│   │   │   └── UserDropdown.tsx     # User menu dropdown
│   │   │
│   │   ├── tables/                  # Table components
│   │   │   ├── BasicTableOne.tsx    # Basic data table
│   │   │   └── Pagination.tsx       # Pagination component
│   │   │
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── alert/
│   │   │   │   └── Alert.tsx        # Alert/notification component
│   │   │   ├── avatar/
│   │   │   │   ├── Avatar.tsx       # Avatar with image
│   │   │   │   └── AvatarText.tsx   # Avatar with initials
│   │   │   ├── badge/
│   │   │   │   └── Badge.tsx        # Badge/pill component
│   │   │   ├── button/
│   │   │   │   └── Button.tsx       # Button with variants
│   │   │   ├── dropdown/
│   │   │   │   ├── Dropdown.tsx     # Dropdown container
│   │   │   │   └── DropdownItem.tsx # Dropdown item
│   │   │   ├── images/
│   │   │   │   ├── ResponsiveImage.tsx
│   │   │   │   ├── ThreeColumnImageGrid.tsx
│   │   │   │   └── TwoColumnImageGrid.tsx
│   │   │   ├── modal/
│   │   │   │   └── index.tsx        # Modal component
│   │   │   ├── table/
│   │   │   │   └── index.tsx        # Table component
│   │   │   └── video/
│   │   │       ├── VideosExample.tsx
│   │   │       └── YouTubeEmbed.tsx # YouTube embed component
│   │   │
│   │   ├── user-profile/            # User profile components
│   │   │   ├── UserAddressCard.tsx  # Address information
│   │   │   ├── UserInfoCard.tsx     # Basic user info
│   │   │   └── UserMetaCard.tsx     # User metadata
│   │   │
│   │   └── videos/                  # Video aspect ratio components
│   │       ├── FourIsToThree.tsx    # 4:3 aspect ratio
│   │       ├── OneIsToOne.tsx       # 1:1 (square)
│   │       ├── SixteenIsToNine.tsx  # 16:9 (widescreen)
│   │       └── TwentyOneIsToNine.tsx # 21:9 (ultra-wide)
│   │
│   ├── context/                     # React Context providers
│   │   ├── SidebarContext.tsx       # Sidebar state (open/closed/hover)
│   │   └── ThemeContext.tsx         # Theme state (light/dark mode)
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useGoBack.ts             # Hook for back navigation
│   │   ├── useModal.ts              # Hook for modal state
│   │   └── useRedux.ts              # Typed Redux hooks
│   │
│   ├── icons/                       # SVG icon components
│   │   ├── index.tsx                # Exports all icons as components
│   │   └── [50+ SVG files]          # Individual icon files
│   │
│   ├── layout/                      # Layout components
│   │   ├── AppHeader.tsx            # Top header (search, notifications, user)
│   │   ├── AppSidebar.tsx           # Left sidebar navigation
│   │   ├── Backdrop.tsx             # Mobile sidebar backdrop
│   │   └── SidebarWidget.tsx        # Sidebar widget section
│   │
│   ├── middleware.ts                # Next.js middleware (route protection)
│   └── svg.d.ts                     # TypeScript declarations for SVG imports
│
├── Configuration Files
├── .eslintrc.json                   # ESLint configuration
├── eslint.config.mjs                # ESLint config (new format)
├── jsvectormap.d.ts                 # TypeScript declarations for JVectorMap
├── next-env.d.ts                    # Next.js TypeScript declarations
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── prettier.config.js               # Prettier configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── LICENSE                          # Project license
└── README.md                        # Project readme
```

---

## Pages

### Overview
The application has 4 active pages organized into 2 route groups.

### 1. Authentication Pages (`/auth/*`)

#### `/auth/signin` - Sign In Page
**File**: `src/app/(auth)/auth/signin/page.tsx`

**Purpose**: User login page

**Features**:
- Email and password inputs
- Social login buttons (Google, X/Twitter)
- Remember me checkbox
- Forgot password link
- Sign up redirect link
- Back to dashboard link

**Component Used**: `SignInForm.tsx`

**Layout**: `src/app/(auth)/auth/layout.tsx` (Split screen with branding)

**Metadata**:
```typescript
title: "Next.js SignIn Page | TailAdmin"
description: "This is Next.js Signin Page TailAdmin Dashboard Template"
```

#### `/auth/signup` - Sign Up Page
**File**: `src/app/(auth)/auth/signup/page.tsx`

**Purpose**: New user registration

**Features**:
- First name and last name inputs
- Email input
- Password input with visibility toggle
- Social signup buttons (Google, X)
- Terms and conditions checkbox
- Sign in redirect link
- Back to dashboard link

**Component Used**: `SignUpForm.tsx`

**Layout**: Same split-screen layout as signin

**Metadata**:
```typescript
title: "Next.js SignUp Page | TailAdmin"
description: "This is Next.js SignUp Page TailAdmin Dashboard Template"
```

### 2. Dashboard Pages (`/dashboard/*`)

#### `/dashboard` - Main Dashboard (Ecommerce)
**File**: `src/app/(dashboard)/dashboard/page.tsx`

**Purpose**: Main dashboard with ecommerce metrics

**Features**:
- Ecommerce metrics cards (Sales, Revenue, Orders)
- Monthly sales chart
- Monthly target vs actual
- Statistics overview
- Demographics chart
- Recent orders table

**Components Used**:
- `EcommerceMetrics`
- `MonthlySalesChart`
- `MonthlyTarget`
- `StatisticsChart`
- `DemographicCard`
- `RecentOrders`

**Layout**: `src/app/(dashboard)/dashboard/layout.tsx` (Sidebar + Header)

**Metadata**:
```typescript
title: "Next.js E-commerce Dashboard | TailAdmin"
description: "This is Next.js Home for TailAdmin Dashboard Template"
```

**Grid Layout**:
```tsx
12-column grid:
- Left column (7 cols): Metrics + Sales Chart
- Right column (5 cols): Monthly Target
- Full width: Statistics Chart
- Split: Demographics (5 cols) + Recent Orders (7 cols)
```

#### `/dashboard/profile` - User Profile
**File**: `src/app/(dashboard)/dashboard/(others-pages)/profile/page.tsx`

**Purpose**: User profile management page

**Features**:
- User information card
- User metadata card
- Address card
- Edit profile capability

**Components Used**:
- `UserInfoCard`
- `UserMetaCard`
- `UserAddressCard`

**Layout**: Same dashboard layout with sidebar

### 3. Special Pages

#### Root Page `/`
**File**: `src/app/page.tsx`

**Purpose**: Redirect to dashboard

**Behavior**: Automatically redirects to `/dashboard`

**Code**:
```typescript
import { redirect } from "next/navigation";
export default function HomePage() {
  redirect("/dashboard");
}
```

#### 404 Page
**File**: `src/app/not-found.tsx`

**Purpose**: Handle 404 errors

**Features**:
- Error illustration (light/dark mode)
- "ERROR" heading
- Descriptive text
- "Back to Home Page" button → redirects to `/dashboard`
- Grid shape decoration
- Footer with copyright

---

## Layouts

### Layout Hierarchy

```
Root Layout (layout.tsx)
│
├── Auth Layout (auth/layout.tsx)
│   └── Auth Pages (signin, signup)
│
└── Dashboard Layout (dashboard/layout.tsx)
    └── Dashboard Pages (dashboard, profile)
```

### 1. Root Layout
**File**: `src/app/layout.tsx`

**Purpose**: Wraps the entire application

**Responsibilities**:
- Set HTML lang attribute
- Load Google Font (Outfit)
- Apply global CSS
- Provide Redux store
- Provide Theme context
- Provide Sidebar context

**Structure**:
```tsx
<html lang="en">
  <body>
    <ReduxProvider>
      <ThemeProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </ThemeProvider>
    </ReduxProvider>
  </body>
</html>
```

**Providers Order** (Outer to Inner):
1. **ReduxProvider** - Makes Redux store available
2. **ThemeProvider** - Manages dark/light mode
3. **SidebarProvider** - Manages sidebar state

### 2. Auth Layout
**File**: `src/app/(auth)/auth/layout.tsx`

**Purpose**: Layout for authentication pages (no sidebar)

**Features**:
- Split-screen design
- Left side: Form (signin/signup)
- Right side: Branding
  - Grid shape decoration
  - Logo
  - Tagline: "Free and Open-Source Tailwind CSS Admin Dashboard Template"
- Theme toggler (bottom right)
- Dedicated ThemeProvider (separate from root)

**Design**:
- Responsive: Stacks vertically on mobile, side-by-side on desktop
- Branding section: Hidden on mobile, visible on `lg` screens
- Full height (`h-screen`)
- Background: White (light) / Gray-900 (dark)

### 3. Dashboard Layout
**File**: `src/app/(dashboard)/dashboard/layout.tsx`

**Purpose**: Layout for dashboard pages (with sidebar and header)

**Features**:
- **Sidebar** (`AppSidebar`): Left navigation
- **Header** (`AppHeader`): Top bar with search, notifications, user menu
- **Backdrop** (`Backdrop`): Overlay for mobile menu
- **Main Content**: Page content with max-width constraint

**Responsive Behavior**:
- **Desktop**: Sidebar always visible, can be collapsed/expanded
- **Mobile**: Sidebar hidden by default, opens as overlay
- **Dynamic Margin**: Main content adjusts margin based on sidebar state
  - Collapsed: `ml-[90px]`
  - Expanded: `ml-[290px]`
  - Mobile: `ml-0`

**Structure**:
```tsx
<div className="min-h-screen xl:flex">
  <AppSidebar />
  <Backdrop />
  <div className="flex-1 transition-all">
    <AppHeader />
    <div className="p-4 md:p-6">
      {children}
    </div>
  </div>
</div>
```

**Uses Context**:
- `useSidebar()` from `SidebarContext` for sidebar state

---

## Components

### Component Organization

Components are organized by feature/domain:

- **auth/** - Authentication UI
- **calendar/** - Calendar components
- **charts/** - Chart visualizations
- **common/** - Shared utilities
- **ecommerce/** - Dashboard widgets
- **form/** - Form inputs and controls
- **header/** - Header-specific components
- **tables/** - Data tables
- **ui/** - Reusable UI primitives
- **user-profile/** - Profile-specific components
- **videos/** - Video players and aspect ratios

### Detailed Component Breakdown

#### 🔐 Authentication Components (`/auth`)

##### SignInForm.tsx
**Purpose**: Complete sign-in form with all fields and styling

**Props**: None (self-contained)

**Features**:
- Email input
- Password input with show/hide toggle
- "Keep me logged in" checkbox
- Social login buttons (Google, X)
- Form validation (client-side ready)
- Links: Forgot password, Sign up, Back to dashboard

**State**:
```typescript
const [showPassword, setShowPassword] = useState(false);
const [isChecked, setIsChecked] = useState(false);
```

**UI Elements Used**:
- `Input` - Email and password fields
- `Checkbox` - Remember me
- `Label` - Field labels
- `Button` - Submit button
- SVG icons for social logins

**Integration Points**:
- Ready for Redux `signIn` action
- Can be connected to API endpoint
- Form submission handler (to be implemented)

##### SignUpForm.tsx
**Purpose**: Complete registration form

**Props**: None

**Features**:
- First name + Last name (split row on desktop)
- Email input
- Password with visibility toggle
- Terms & conditions checkbox
- Social signup buttons
- Link to sign in
- Back to dashboard link

**State**:
```typescript
const [showPassword, setShowPassword] = useState(false);
const [isChecked, setIsChecked] = useState(false);
```

**UI Elements**:
- Grid layout for name fields
- All form inputs from `/form/input`
- Social auth buttons with SVG icons

#### 📅 Calendar Component (`/calendar`)

##### Calendar.tsx
**Purpose**: Full-featured calendar using FullCalendar library

**Props**: None (can be extended for events)

**Features**:
- Month, week, day views
- Drag and drop events
- Click to add events
- Event list view
- Time grid view
- Responsive design

**Dependencies**:
- `@fullcalendar/react`
- `@fullcalendar/daygrid`
- `@fullcalendar/timegrid`
- `@fullcalendar/list`
- `@fullcalendar/interaction`

**Usage**:
```tsx
import Calendar from "@/components/calendar/Calendar";
<Calendar />
```

#### 📊 Chart Components (`/charts`)

##### BarChartOne.tsx
**Purpose**: Vertical bar chart visualization

**Props**: 
```typescript
{
  data?: number[];
  categories?: string[];
  title?: string;
}
```

**Features**:
- Interactive tooltips
- Customizable colors
- Responsive sizing
- Dark mode support

**Library**: ApexCharts

**Default Configuration**:
```typescript
{
  chart: { type: 'bar' },
  colors: ['#3C50E0'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
    }
  }
}
```

##### LineChartOne.tsx
**Purpose**: Line chart for trends over time

**Props**:
```typescript
{
  series?: Array<{name: string, data: number[]}>;
  categories?: string[];
}
```

**Features**:
- Multiple data series
- Area fill option
- Markers on data points
- Zoom functionality
- Responsive

**Library**: ApexCharts

#### 🎨 Common Components (`/common`)

##### PageBreadCrumb.tsx
**Purpose**: Breadcrumb navigation

**Props**:
```typescript
{
  pageTitle: string;
}
```

**Structure**:
```
Home > {pageTitle}
```

**Features**:
- Links to home (`/dashboard`)
- Shows current page
- Chevron separator
- Responsive text sizing

##### ThemeToggleButton.tsx
**Purpose**: Toggle between light and dark mode

**Props**: None (uses context)

**Implementation**:
```tsx
const { theme, setTheme } = useTheme();
```

**Features**:
- Sun icon for light mode
- Moon icon for dark mode
- Smooth transition
- Persists preference

##### ThemeTogglerTwo.tsx
**Purpose**: Alternative theme toggler design

**Difference**: Different visual style, same functionality

##### ComponentCard.tsx
**Purpose**: Card wrapper for displaying components

**Props**:
```typescript
{
  title?: string;
  children: React.ReactNode;
}
```

**Usage**:
```tsx
<ComponentCard title="Example Component">
  <YourComponent />
</ComponentCard>
```

##### GridShape.tsx
**Purpose**: Decorative grid background pattern

**Props**: None

**Usage**: Background decoration for auth pages and error pages

##### ChartTab.tsx
**Purpose**: Tab switcher for charts

**Props**:
```typescript
{
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}
```

#### 💼 Ecommerce Components (`/ecommerce`)

##### EcommerceMetrics.tsx
**Purpose**: Display key business metrics

**Metrics Shown**:
1. **Total views** - Page/product views
2. **Total profit** - Revenue metrics
3. **Total products** - Inventory count
4. **Total users** - User count

**Props**: None (can be extended for dynamic data)

**Features**:
- Icon for each metric
- Current value
- Percentage change
- Up/down indicators
- Color coding (green=up, red=down)

**Grid**: 4 columns on desktop, stacks on mobile

##### MonthlySalesChart.tsx
**Purpose**: Visualize sales over months

**Type**: Line/Area chart

**Features**:
- Monthly data points
- Tooltip on hover
- Gradient fill
- Responsive legend

##### MonthlyTarget.tsx
**Purpose**: Compare target vs actual performance

**Visualization**: Circular progress chart

**Shows**:
- Target amount
- Actual amount
- Percentage achieved
- Visual progress ring

##### StatisticsChart.tsx
**Purpose**: Overview statistics with chart

**Features**:
- Multiple stat cards
- Combined chart view
- Time period selector
- Compare periods

##### DemographicCard.tsx
**Purpose**: User demographics visualization

**Shows**:
- Age groups
- Gender distribution
- Geographic data
- Pie/donut charts

##### CountryMap.tsx
**Purpose**: Interactive world map with data

**Library**: React JVectorMap

**Features**:
- Click on countries
- Hover tooltips
- Color coding by value
- Zoom and pan

##### RecentOrders.tsx
**Purpose**: Table of recent orders

**Columns**:
- Order ID
- Customer name
- Product
- Amount
- Status
- Date

**Features**:
- Sortable columns
- Status badges
- Action buttons
- Pagination ready

#### 📝 Form Components (`/form`)

##### Input Components (`/form/input/`)

###### InputField.tsx
**Purpose**: Basic text input

**Props**:
```typescript
{
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}
```

**Variants**:
- Default styling
- Error state
- Disabled state
- Dark mode support

###### Checkbox.tsx
**Purpose**: Checkbox input

**Props**:
```typescript
{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}
```

**Features**:
- Custom styled
- Checkmark animation
- Keyboard accessible

###### Radio.tsx
**Purpose**: Radio button input

**Props**:
```typescript
{
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label?: string;
}
```

###### RadioSm.tsx
**Purpose**: Smaller radio button variant

###### TextArea.tsx
**Purpose**: Multi-line text input

**Props**:
```typescript
{
  rows?: number;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
}
```

**Features**:
- Auto-resize option
- Character counter
- Max length validation

###### FileInput.tsx
**Purpose**: File upload input

**Props**:
```typescript
{
  accept?: string;
  multiple?: boolean;
  onChange?: (files: FileList) => void;
}
```

**Features**:
- Drag and drop support (via DropZone)
- File type validation
- Size validation
- Preview images

##### Form Element Examples (`/form/form-elements/`)

These are example implementations showing how to use form components:

- **DefaultInputs.tsx** - Standard input examples
- **CheckboxComponents.tsx** - Various checkbox styles
- **RadioButtons.tsx** - Radio button groups
- **SelectInputs.tsx** - Dropdown selects
- **TextAreaInput.tsx** - Text area examples
- **FileInputExample.tsx** - File upload examples
- **DropZone.tsx** - Drag & drop file upload
- **ToggleSwitch.tsx** - Switch/toggle examples
- **InputGroup.tsx** - Input with icons/buttons
- **InputStates.tsx** - Input states (error, success, etc.)

##### Other Form Components

###### Label.tsx
**Purpose**: Form field label

**Props**:
```typescript
{
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}
```

**Features**:
- Required indicator (*)
- Accessible (connects to input via htmlFor)

###### Select.tsx
**Purpose**: Dropdown select input

**Props**:
```typescript
{
  options: Array<{value: string, label: string}>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}
```

###### MultiSelect.tsx
**Purpose**: Multi-select dropdown

**Props**:
```typescript
{
  options: Array<{value: string, label: string}>;
  value?: string[];
  onChange?: (values: string[]) => void;
}
```

**Features**:
- Checkboxes for options
- Select all option
- Search/filter
- Selected count

###### date-picker.tsx
**Purpose**: Date/time picker

**Library**: Flatpickr

**Props**:
```typescript
{
  value?: Date;
  onChange?: (date: Date) => void;
  enableTime?: boolean;
  dateFormat?: string;
}
```

**Features**:
- Calendar popup
- Time selection
- Date range selection
- Min/max dates

###### Switch.tsx
**Purpose**: Toggle switch

**Props**:
```typescript
{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

**Features**:
- Smooth animation
- Different sizes
- Disabled state

#### 🎛️ Header Components (`/header`)

##### UserDropdown.tsx
**Purpose**: User menu dropdown in header

**Features**:
- User avatar
- User name and email
- Menu items:
  - Edit profile → `/dashboard/profile`
  - Account settings → `/dashboard/profile`
  - Support → `/dashboard/profile`
  - Sign out → `/auth/signin`
- Click outside to close
- Smooth animations

**State**:
```typescript
const [isOpen, setIsOpen] = useState(false);
```

**Integration**: Uses `Dropdown` and `DropdownItem` from `/ui`

##### NotificationDropdown.tsx
**Purpose**: Notification bell with dropdown

**Features**:
- Bell icon with notification dot
- Animated ping effect
- Scrollable notification list
- Each notification shows:
  - User avatar
  - Notification text
  - Time ago
  - Read/unread status
- "View All Notifications" link
- Auto-close on item click

**State**:
```typescript
const [isOpen, setIsOpen] = useState(false);
const [notifying, setNotifying] = useState(true); // Red dot
```

#### 📋 Table Components (`/tables`)

##### BasicTableOne.tsx
**Purpose**: Simple data table

**Props**:
```typescript
{
  data: Array<any>;
  columns: Array<{key: string, label: string}>;
}
```

**Features**:
- Header row with column labels
- Data rows
- Zebra striping (alternating row colors)
- Responsive scroll on mobile
- Dark mode support

**Example**:
```tsx
<BasicTableOne 
  data={users}
  columns={[
    {key: 'name', label: 'Name'},
    {key: 'email', label: 'Email'},
    {key: 'role', label: 'Role'},
  ]}
/>
```

##### Pagination.tsx
**Purpose**: Table pagination controls

**Props**:
```typescript
{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}
```

**Features**:
- Previous/Next buttons
- Page numbers
- Jump to page
- Items per page selector
- Showing "X-Y of Z results"

#### 🎨 UI Components (`/ui`)

##### alert/Alert.tsx
**Purpose**: Alert/notification banners

**Props**:
```typescript
{
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}
```

**Types**:
- **Success** - Green, checkmark icon
- **Error** - Red, X icon
- **Warning** - Yellow, exclamation icon
- **Info** - Blue, info icon

**Features**:
- Icon based on type
- Optional close button
- Auto-dismiss option
- Slide-in animation

##### avatar/Avatar.tsx
**Purpose**: User avatar with image

**Props**:
```typescript
{
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy';
}
```

**Features**:
- Multiple sizes (xs, sm, md, lg, xl)
- Shapes (circle, square, rounded)
- Status indicator dot
- Fallback to initials if image fails

##### avatar/AvatarText.tsx
**Purpose**: Avatar showing initials

**Props**:
```typescript
{
  name: string;
  size?: 'sm' | 'md' | 'lg';
  backgroundColor?: string;
}
```

**Features**:
- Extracts initials from name
- Random or custom background color
- Same sizes as regular Avatar

##### badge/Badge.tsx
**Purpose**: Small label/badge

**Props**:
```typescript
{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}
```

**Variants**:
- Default - Gray
- Success - Green
- Error - Red
- Warning - Yellow
- Info - Blue

**Usage**:
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="error">Disabled</Badge>
```

##### button/Button.tsx
**Purpose**: Primary button component

**Props**:
```typescript
{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**Variants**:
- **Primary** - Brand color, filled
- **Secondary** - Gray, filled
- **Outline** - Border only, transparent background
- **Ghost** - No border, transparent, hover effect
- **Danger** - Red, for destructive actions

**Features**:
- Loading state with spinner
- Disabled state
- Icons (left or right)
- Multiple sizes
- Fully accessible

**Example**:
```tsx
<Button variant="primary" size="md" loading={isLoading}>
  Save Changes
</Button>
```

##### dropdown/Dropdown.tsx
**Purpose**: Dropdown container/wrapper

**Props**:
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  position?: 'left' | 'right' | 'center';
}
```

**Features**:
- Click outside to close
- Keyboard navigation (Escape to close)
- Portal rendering option
- Smooth animations
- Positioning (left, right, center)

##### dropdown/DropdownItem.tsx
**Purpose**: Individual dropdown menu item

**Props**:
```typescript
{
  children: React.ReactNode;
  onClick?: () => void;
  onItemClick?: () => void;
  href?: string;
  tag?: 'a' | 'button';
  className?: string;
  icon?: React.ReactNode;
}
```

**Features**:
- Can be link (`<a>`) or button
- Optional icon
- Hover effects
- Keyboard navigation

**Usage**:
```tsx
<Dropdown isOpen={isOpen} onClose={handleClose}>
  <DropdownItem onClick={handleProfile}>
    Profile
  </DropdownItem>
  <DropdownItem onClick={handleSettings}>
    Settings
  </DropdownItem>
</Dropdown>
```

##### images/ResponsiveImage.tsx
**Purpose**: Responsive image component

**Props**:
```typescript
{
  src: string;
  alt: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
  objectFit?: 'cover' | 'contain' | 'fill';
}
```

##### images/TwoColumnImageGrid.tsx
**Purpose**: 2-column image grid layout

##### images/ThreeColumnImageGrid.tsx
**Purpose**: 3-column image grid layout

##### modal/index.tsx
**Purpose**: Modal dialog component

**Props**:
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  title?: string;
}
```

**Sub-components**:
```tsx
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>
    <Button>Action</Button>
  </Modal.Footer>
</Modal>
```

**Features**:
- Backdrop overlay
- Click outside to close
- Escape key to close
- Focus trap
- Scroll lock
- Animations (fade in/out, slide)
- Fullscreen option
- Responsive sizes

##### table/index.tsx
**Purpose**: Advanced data table

**Props**:
```typescript
{
  data: Array<any>;
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  sortable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  onRowClick?: (row: any) => void;
}
```

**Features**:
- Column sorting
- Pagination
- Custom cell rendering
- Row selection
- Bulk actions
- Search/filter
- Responsive (horizontal scroll on mobile)

##### video/YouTubeEmbed.tsx
**Purpose**: Embed YouTube videos

**Props**:
```typescript
{
  videoId: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
}
```

##### video/VideosExample.tsx
**Purpose**: Video player examples

#### 👤 User Profile Components (`/user-profile`)

##### UserInfoCard.tsx
**Purpose**: Display basic user information

**Shows**:
- Profile picture
- Name
- Email
- Bio
- Join date
- Edit button

##### UserMetaCard.tsx
**Purpose**: User metadata and stats

**Shows**:
- Total posts
- Followers
- Following
- Location
- Website
- Social links

##### UserAddressCard.tsx
**Purpose**: User address information

**Shows**:
- Street address
- City
- State/Province
- Postal code
- Country
- Edit button

#### 📹 Video Aspect Ratio Components (`/videos`)

These components maintain specific aspect ratios for videos:

- **FourIsToThree.tsx** - 4:3 ratio (traditional TV)
- **OneIsToOne.tsx** - 1:1 ratio (square, social media)
- **SixteenIsToNine.tsx** - 16:9 ratio (widescreen, YouTube)
- **TwentyOneIsToNine.tsx** - 21:9 ratio (ultra-wide, cinematic)

**Usage**:
```tsx
<SixteenIsToNine>
  <video src="video.mp4" />
</SixteenIsToNine>
```

#### 📚 Example Components (`/example`)

Modal examples showing different modal patterns:
- Default modal
- Full-screen modal
- Vertically centered modal
- Form in modal
- Modal-based alerts

---

## State Management (Redux)

### Architecture

```
Redux Store (store.ts)
    ↓
Root Reducer (rootReducer.ts) + Redux Persist
    ↓
Feature Slices (features/)
    ├── authSlice.ts (authentication)
    └── [future slices]
```

### Files

#### 1. `store.ts` - Store Configuration

**Location**: `src/_core/store/store.ts`

**Purpose**: Configure and create Redux store

**Configuration**:
```typescript
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [PURGE, FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
      },
    }),
});
```

**Exports**:
- `store` - The configured store
- `RootState` - TypeScript type for entire state
- `AppDispatch` - TypeScript type for dispatch function

#### 2. `rootReducer.ts` - Root Reducer with Persistence

**Location**: `src/_core/reducer/rootReducer.ts`

**Purpose**: Combine all reducers and configure persistence

**Reducers Combined**:
```typescript
const appReducer = combineReducers({
  auth: authReducer,
  // Add more reducers here as you create them
});
```

**Persistence Configuration**:
```typescript
const persistedReducers = persistReducer(
  {
    key: "root",
    storage, // localStorage
    whitelist: ["auth"], // Only persist auth slice
  },
  rootReducer
);
```

**Special Behavior**:
- On `signOut` action, clears persisted data
- Resets all state to initial values
- Removes `persist:root` from localStorage

#### 3. `authSlice.ts` - Authentication Slice

**Location**: `src/_core/features/authSlice.ts`

**Purpose**: Manage authentication state

**State Shape**:
```typescript
interface AuthState {
  user: User | null;           // Current user data
  session: string | null;      // Session token
  profile: any | null;         // User profile data
  isLoading: boolean;          // General loading
  isSigningIn: boolean;        // Sign in loading
  isSigningUp: boolean;        // Sign up loading
  error: string | null;        // Error message
}
```

**User Type**:
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
}
```

**Actions (Async Thunks)**:

1. **signIn**
   ```typescript
   dispatch(signIn({ email, password }))
   ```
   - Signs in user
   - Sets `isSigningIn` loading state
   - On success: Should set user data (TODO: implement API)
   - On error: Sets error message

2. **signUp**
   ```typescript
   dispatch(signUp({ email, password, name }))
   ```
   - Registers new user
   - Sets `isSigningUp` loading state
   - Similar pattern to signIn

3. **signOut**
   ```typescript
   dispatch(signOut())
   ```
   - Signs out user
   - Clears user data
   - Triggers persistence cleanup (in rootReducer)
   - Redirects to signin (in component)

**Synchronous Actions**:

1. **clearError**
   ```typescript
   dispatch(clearError())
   ```
   - Clears error message

2. **setUser**
   ```typescript
   dispatch(setUser(userData))
   ```
   - Manually set user data
   - Useful for session restoration

**Usage Example**:
```typescript
const LoginComponent = () => {
  const dispatch = useAppDispatch();
  const { isSigningIn, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(signIn({ email, password })).unwrap();
      router.push('/dashboard');
    } catch (err) {
      // Error is in state
    }
  };
};
```

#### 4. `ReduxProvider.tsx` - Provider Component

**Location**: `src/_core/providers/ReduxProvider.tsx`

**Purpose**: Wrap app with Redux Provider and PersistGate

**Code**:
```typescript
"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
```

**PersistGate**:
- Delays rendering until persisted state is retrieved
- `loading={null}` - No loading component while rehydrating
- Prevents flash of empty state

#### 5. `useRedux.ts` - Typed Hooks

**Location**: `src/hooks/useRedux.ts`

**Purpose**: Provide typed Redux hooks

**Exports**:
```typescript
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Why?**: 
- Type safety for dispatch and selectors
- Autocomplete for state structure
- Catches type errors at compile time

**Usage**:
```typescript
// Instead of:
const dispatch = useDispatch();
const user = useSelector((state) => state.auth.user);

// Use:
const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);
```

---

## Context Providers

### 1. ThemeContext

**Location**: `src/context/ThemeContext.tsx`

**Purpose**: Manage light/dark theme

**State**:
```typescript
{
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}
```

**Features**:
- Reads initial theme from localStorage
- Applies `dark` class to document root
- Persists theme choice
- Provides toggle function

**Usage**:
```typescript
const { theme, setTheme } = useTheme();

<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  Toggle Theme
</button>
```

### 2. SidebarContext

**Location**: `src/context/SidebarContext.tsx`

**Purpose**: Manage sidebar state

**State**:
```typescript
{
  isExpanded: boolean;        // Desktop: expanded or collapsed
  isHovered: boolean;         // Desktop: hover state
  isMobileOpen: boolean;      // Mobile: open or closed
  toggleSidebar: () => void;  // Toggle desktop sidebar
  toggleMobileSidebar: () => void; // Toggle mobile sidebar
  setIsHovered: (hovered: boolean) => void; // Set hover state
}
```

**Behavior**:
- **Desktop** (`>= 1024px`):
  - Sidebar can be collapsed (90px wide) or expanded (290px wide)
  - Hover to temporarily expand collapsed sidebar
  - Toggle button in header
- **Mobile** (`< 1024px`):
  - Sidebar hidden by default
  - Opens as overlay when toggled
  - Backdrop closes sidebar

**Usage**:
```typescript
const { isExpanded, toggleSidebar } = useSidebar();

<button onClick={toggleSidebar}>
  {isExpanded ? 'Collapse' : 'Expand'}
</button>
```

---

## Middleware

**Location**: `src/middleware.ts`

**Purpose**: Next.js middleware for route protection

**Runs On**: Every request (except static files, API routes, etc.)

### Configuration

**Matcher**: Defines which routes the middleware runs on
```typescript
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
```

### Route Lists

**Public Routes** (no authentication required):
```typescript
const publicRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
];
```

**Auth Routes** (redirect if authenticated):
```typescript
const authRoutes = [
  "/auth/signin",
  "/auth/signup",
];
```

### Logic

**Currently**: Authentication logic is commented out for development

**When Enabled** (uncomment the code):

1. **Check Authentication**:
   ```typescript
   const token = request.cookies.get("auth-token");
   const isAuthenticated = !!token;
   ```

2. **Protected Route Access** (not authenticated):
   ```typescript
   if (!isAuthenticated && !isPublicRoute) {
     // Redirect to signin with original URL as redirect param
     return NextResponse.redirect('/auth/signin?redirect=' + pathname);
   }
   ```

3. **Auth Page Access** (already authenticated):
   ```typescript
   if (isAuthenticated && isAuthRoute) {
     // Redirect to dashboard
     return NextResponse.redirect('/dashboard');
   }
   ```

4. **Root Path**:
   ```typescript
   if (pathname === "/") {
     return NextResponse.redirect(
       isAuthenticated ? '/dashboard' : '/auth/signin'
     );
   }
   ```

### Integration with Redux

When you implement authentication:

1. **After Login**:
   ```typescript
   // In sign in handler
   const response = await fetch('/api/auth/signin', { ... });
   const { token } = await response.json();
   
   // Set cookie
   document.cookie = `auth-token=${token}; path=/; max-age=604800`;
   
   // Update Redux
   dispatch(signIn.fulfilled(userData));
   ```

2. **On App Load**:
   ```typescript
   // Check if token exists
   const token = getCookie('auth-token');
   if (token) {
     // Validate token and restore user
     dispatch(setUser(userData));
   }
   ```

---

## Hooks

### Custom Hooks

**Location**: `src/hooks/`

#### 1. `useRedux.ts`
Already covered in Redux section.

#### 2. `useModal.ts`

**Purpose**: Manage modal open/close state

**Code**:
```typescript
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(!isOpen);
  
  return { isOpen, openModal, closeModal, toggleModal };
};
```

**Usage**:
```typescript
const { isOpen, openModal, closeModal } = useModal();

<button onClick={openModal}>Open Modal</button>
<Modal isOpen={isOpen} onClose={closeModal}>
  Content
</Modal>
```

#### 3. `useGoBack.ts`

**Purpose**: Navigate back in browser history

**Code**:
```typescript
import { useRouter } from 'next/navigation';

export const useGoBack = () => {
  const router = useRouter();
  
  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };
  
  return goBack;
};
```

**Usage**:
```typescript
const goBack = useGoBack();

<button onClick={goBack}>
  ← Back
</button>
```

---

## Icons System

**Location**: `src/icons/`

**Total Icons**: 50+ SVG icons

### Icon Export (`index.tsx`)

All icons are exported as React components:
```typescript
import AlertIcon from './alert.svg';
import BellIcon from './bell.svg';
// ... more imports

export {
  AlertIcon,
  BellIcon,
  // ... more exports
};

// Or named exports
export const ChevronDownIcon = () => <svg>...</svg>;
```

### Available Icons

**Navigation**:
- `grid.svg` - Dashboard
- `calendar.svg` - Calendar
- `user-circle.svg` - User profile
- `list.svg` - Lists
- `table.svg` - Tables
- `page.svg` - Pages

**UI Elements**:
- `chevron-down.svg`, `chevron-left.svg`, `chevron-up.svg` - Chevrons
- `angle-down.svg`, `angle-left.svg`, `angle-right.svg`, `angle-up.svg` - Angles
- `arrow-down.svg`, `arrow-right.svg`, `arrow-up.svg` - Arrows
- `plus.svg` - Add
- `close.svg`, `close-line.svg` - Close
- `check-circle.svg`, `check-line.svg` - Check marks

**Alerts & Notifications**:
- `alert.svg` - Alert icon
- `bell.svg` - Notifications
- `info.svg`, `info-hexa.svg` - Information

**Actions**:
- `pencil.svg` - Edit
- `trash.svg` - Delete
- `copy.svg` - Copy
- `download.svg` - Download
- `paper-plane.svg` - Send

**Files & Documents**:
- `file.svg` - Generic file
- `folder.svg` - Folder
- `docs.svg` - Documents
- `audio.svg` - Audio file
- `videos.svg` - Video file

**Communication**:
- `envelope.svg` - Email
- `mail-line.svg` - Mail
- `chat.svg` - Chat

**Misc**:
- `eye.svg`, `eye-close.svg` - Show/hide
- `lock.svg` - Security
- `time.svg` - Time/clock
- `box.svg`, `box-cube.svg`, `box-line.svg` - Package/box
- `shooting-star.svg` - Featured
- `bolt.svg` - Fast/power

### Usage in Components

**Direct Import**:
```typescript
import { ChevronDownIcon } from '@/icons';

<ChevronDownIcon className="w-5 h-5" />
```

**SVG Loader** (SVGR):
Configured in `next.config.ts` to import SVGs as React components:
```typescript
import CalendarIcon from '@/icons/calendar.svg';

<CalendarIcon width={20} height={20} />
```

---

## Styling System

### Tailwind CSS Configuration

**Version**: 4.0.0

**Config File**: `tailwind.config.js`

#### Custom Theme

**Colors**:
```javascript
colors: {
  brand: {
    50: '#f0f9ff',
    // ... full scale
    500: '#3C50E0', // Primary brand color
    950: '#0f1629',
  },
  gray: {
    // Custom gray scale for light/dark mode
    50 to 950
  },
  error: {
    // Red scale for errors
  },
  success: {
    // Green scale for success
  },
  warning: {
    // Yellow scale for warnings
  },
}
```

**Font Family**:
```javascript
fontFamily: {
  sans: ['Outfit', 'system-ui', 'sans-serif'],
}
```

**Spacing**: Extended scale including `4.5`, `7.5`, `12.5`, etc.

**Border Radius**: `theme-xs`, `theme-sm`, `theme-md`, `theme-lg`

**Box Shadow**: `theme-xs`, `theme-sm`, `theme-md`, `theme-lg`

#### Dark Mode

**Strategy**: Class-based
```javascript
darkMode: 'class'
```

**Implementation**:
- Root element gets `dark` class
- All components use `dark:` variants
```tsx
<div className="bg-white dark:bg-gray-900">
```

#### Custom Classes

**Text Sizes**:
```javascript
text-theme-xs   // 0.75rem
text-theme-sm   // 0.875rem
text-theme-md   // 1rem
text-theme-lg   // 1.125rem
```

**Title Sizes**:
```javascript
text-title-xs   // 1.5rem
text-title-sm   // 1.875rem
text-title-md   // 2.25rem
text-title-lg   // 3rem
text-title-xl   // 3.75rem
text-title-2xl  // 4.5rem
```

### Global Styles

**File**: `src/app/globals.css`

**Includes**:
1. Tailwind directives
2. Custom scrollbar styles
3. Smooth scroll behavior
4. Focus outline removal for mouse users
5. Print styles

**Custom Scrollbar**:
```css
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4a5568;
}
```

### Component Styling Patterns

**Card Pattern**:
```tsx
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
  {/* Content */}
</div>
```

**Button Pattern**:
```tsx
<button className="rounded-lg bg-brand-500 px-4 py-2 text-white transition hover:bg-brand-600 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10">
  Click Me
</button>
```

**Input Pattern**:
```tsx
<input className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white" />
```

---

## How Everything Connects

### Application Flow Diagram

```
User opens browser
      ↓
http://localhost:3000
      ↓
Next.js Server
      ↓
middleware.ts runs
├── Checks auth cookie
├── Checks pathname
└── Redirects if needed
      ↓
Root Layout (app/layout.tsx)
├── Loads Outfit font
├── Wraps with ReduxProvider
│   ├── Provides store
│   └── PersistGate rehydrates state
├── Wraps with ThemeProvider
│   └── Manages light/dark mode
└── Wraps with SidebarProvider
    └── Manages sidebar state
      ↓
Route-specific layout
├── Auth layout (auth/layout.tsx)
│   ├── No sidebar
│   ├── Split screen design
│   └── Theme toggler
│
└── Dashboard layout (dashboard/layout.tsx)
    ├── AppSidebar (left navigation)
    ├── AppHeader (top bar)
    ├── Backdrop (mobile overlay)
    └── Main content area
      ↓
Page component
├── Uses useAppSelector (Redux)
├── Uses useSidebar (Context)
├── Uses useTheme (Context)
├── Fetches/displays data
└── Renders UI components
      ↓
User interaction
├── Click button
├── Submit form
├── Toggle theme
└── Navigate
      ↓
State update
├── Redux dispatch (if global state)
├── Context update (if UI state)
└── Local state (if component-specific)
      ↓
Re-render with new data
```

### Data Flow Example: User Sign In

1. **User visits** `/auth/signin`
   ```
   middleware.ts → checks no auth cookie → allows access
   ```

2. **Page renders** `SignInForm.tsx`
   ```tsx
   <SignInForm />
   // Shows email/password inputs
   ```

3. **User enters credentials** and clicks "Sign In"
   ```tsx
   const handleSubmit = async (e) => {
     e.preventDefault();
     // ...
   }
   ```

4. **Dispatch signIn action**
   ```typescript
   const result = await dispatch(signIn({ email, password })).unwrap();
   ```

5. **authSlice.ts** handles the action
   ```typescript
   // Sets isSigningIn = true
   // Makes API call (TODO)
   // On success: Sets user data
   // On error: Sets error message
   ```

6. **Component receives result**
   ```typescript
   if (success) {
     router.push('/dashboard');
   }
   ```

7. **User navigated to** `/dashboard`
   ```
   middleware.ts → checks auth cookie → allows access
   ```

8. **Dashboard renders** with user data
   ```tsx
   const user = useAppSelector((state) => state.auth.user);
   // Shows user info in header
   ```

### Component Communication

**Parent to Child** - Props
```tsx
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

**Child to Parent** - Callbacks
```tsx
// Parent
<Modal onClose={() => setIsOpen(false)} />

// Child
<button onClick={onClose}>Close</button>
```

**Sibling to Sibling** - Shared State
```tsx
// Via Context or Redux
const { user } = useAppSelector((state) => state.auth);
```

**Global State** - Redux
```tsx
// Any component
const dispatch = useAppDispatch();
dispatch(signOut());

// Any other component immediately sees the change
const user = useAppSelector((state) => state.auth.user); // null
```

---

## Development Guide

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

5. **Lint Code**
   ```bash
   npm run lint
   ```

### Adding a New Page

**Example**: Add a "Settings" page

1. **Create page file**
   ```
   src/app/(dashboard)/dashboard/settings/page.tsx
   ```

2. **Add page component**
   ```tsx
   import type { Metadata } from "next";
   
   export const metadata: Metadata = {
     title: "Settings | Dashboard",
   };
   
   export default function SettingsPage() {
     return (
       <div>
         <h1>Settings</h1>
         {/* Your content */}
       </div>
     );
   }
   ```

3. **Add to sidebar** (src/layout/AppSidebar.tsx)
   ```tsx
   const navItems: NavItem[] = [
     // ... existing items
     {
       icon: <SettingsIcon />,
       name: "Settings",
       path: "/dashboard/settings",
     },
   ];
   ```

4. **Access at** `http://localhost:3000/dashboard/settings`

### Adding a New Component

**Example**: Create a "StatusBadge" component

1. **Create component file**
   ```
   src/components/ui/status/StatusBadge.tsx
   ```

2. **Write component**
   ```tsx
   interface StatusBadgeProps {
     status: 'active' | 'inactive' | 'pending';
   }
   
   export default function StatusBadge({ status }: StatusBadgeProps) {
     const colors = {
       active: 'bg-success-100 text-success-800',
       inactive: 'bg-gray-100 text-gray-800',
       pending: 'bg-warning-100 text-warning-800',
     };
     
     return (
       <span className={`rounded px-2 py-1 text-xs ${colors[status]}`}>
         {status}
       </span>
     );
   }
   ```

3. **Use in pages**
   ```tsx
   import StatusBadge from '@/components/ui/status/StatusBadge';
   
   <StatusBadge status="active" />
   ```

### Adding a New Redux Slice

**Example**: Add a "users" slice

1. **Create slice file**
   ```
   src/_core/features/usersSlice.ts
   ```

2. **Define slice**
   ```tsx
   import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
   
   export const fetchUsers = createAsyncThunk(
     'users/fetchUsers',
     async () => {
       const response = await fetch('/api/users');
       return response.json();
     }
   );
   
   const usersSlice = createSlice({
     name: 'users',
     initialState: {
       list: [],
       loading: false,
     },
     reducers: {},
     extraReducers: (builder) => {
       builder
         .addCase(fetchUsers.pending, (state) => {
           state.loading = true;
         })
         .addCase(fetchUsers.fulfilled, (state, action) => {
           state.loading = false;
           state.list = action.payload;
         });
     },
   });
   
   export default usersSlice.reducer;
   ```

3. **Add to rootReducer**
   ```tsx
   // src/_core/reducer/rootReducer.ts
   import usersReducer from '../features/usersSlice';
   
   const appReducer = combineReducers({
     auth: authReducer,
     users: usersReducer, // Add here
   });
   ```

4. **Use in components**
   ```tsx
   import { fetchUsers } from '@/_core/features/usersSlice';
   
   const users = useAppSelector((state) => state.users.list);
   dispatch(fetchUsers());
   ```

### File Naming Conventions

**Components**: PascalCase
```
Button.tsx
UserProfile.tsx
SignInForm.tsx
```

**Pages**: lowercase
```
page.tsx
layout.tsx
not-found.tsx
```

**Utilities/Hooks**: camelCase
```
useModal.ts
useRedux.ts
formatDate.ts
```

**Types**: PascalCase with .d.ts
```
types.d.ts
svg.d.ts
```

### Code Style Guide

**Imports Order**:
```tsx
// 1. React
import React, { useState } from 'react';

// 2. Next.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 3. Third-party
import { useDispatch } from 'react-redux';

// 4. Internal - Absolute imports
import Button from '@/components/ui/button/Button';
import { useAppSelector } from '@/hooks/useRedux';

// 5. Internal - Relative imports
import './styles.css';
```

**Component Structure**:
```tsx
// 1. Imports
import React from 'react';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export default function MyComponent({ title }: Props) {
  // 3a. Hooks
  const [state, setState] = useState();
  const router = useRouter();
  
  // 3b. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 3c. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 3d. Early returns
  if (!title) return null;
  
  // 3e. Render
  return (
    <div>
      {title}
    </div>
  );
}
```

### TypeScript Tips

**Type Props**:
```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ children, onClick, disabled }: ButtonProps) {
  // ...
}
```

**Type State**:
```tsx
const [user, setUser] = useState<User | null>(null);
```

**Type Redux State**:
```tsx
// Already handled by useAppSelector
const user = useAppSelector((state) => state.auth.user); // User | null
```

### Debugging Tips

**Redux DevTools**:
```bash
# Install Redux DevTools extension in browser
# View state, actions, and time-travel debug
```

**Next.js Debug**:
```bash
# Add to package.json
"debug": "NODE_OPTIONS='--inspect' next dev"

# Run
npm run debug

# Open chrome://inspect in Chrome
```

**Console Logging**:
```tsx
// Disable in production
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### Performance Optimization

**Use React.memo**:
```tsx
export default React.memo(ExpensiveComponent);
```

**Use useCallback**:
```tsx
const handleClick = useCallback(() => {
  // handler
}, [dependencies]);
```

**Use useMemo**:
```tsx
const sortedData = useMemo(() => {
  return data.sort();
}, [data]);
```

**Lazy Load Components**:
```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

---

## Summary

This is a **comprehensive, production-ready Next.js dashboard template** with:

### Core Features
✅ Next.js 15 with App Router
✅ TypeScript for type safety
✅ Tailwind CSS for styling
✅ Redux Toolkit for state management
✅ Redux Persist for state persistence
✅ Multiple context providers (Theme, Sidebar)
✅ Authentication flow (ready for backend)
✅ Protected routes with middleware
✅ Dark mode support

### Component Library (50+ components)
✅ Forms (inputs, selects, checkboxes, file upload)
✅ UI (buttons, alerts, badges, modals, dropdowns)
✅ Data (tables, charts, maps)
✅ Layout (sidebar, header, breadcrumbs)
✅ Auth (sign in, sign up forms)
✅ Media (images, videos, aspect ratios)

### Pages
✅ Dashboard (ecommerce metrics)
✅ User Profile
✅ Auth pages (signin, signup)
✅ 404 page

### Developer Experience
✅ TypeScript throughout
✅ ESLint configured
✅ Hot reload
✅ Organized file structure
✅ Reusable patterns
✅ Comprehensive documentation

### Ready for Production
✅ Performance optimized
✅ SEO friendly (metadata)
✅ Accessible components
✅ Responsive design
✅ Cross-browser compatible
✅ Scalable architecture

---

**Total Files**: 100+ components, pages, and configuration files
**Total Lines of Code**: ~10,000+
**Technologies Used**: 20+ libraries and tools
**Ready to Build**: Backend integration, API routes, database, etc.


