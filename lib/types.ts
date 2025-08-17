export interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  color: string
  fuelType: "Gasoline" | "Diesel" | "Electric" | "Hybrid"
  transmission: "Manual" | "Automatic"
  bodyType: "Sedan" | "SUV" | "Hatchback" | "Coupe" | "Truck"
  images: string[]
  description: string
  features: string[]
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "customer"
  phone?: string
  password?: string
  provider?: string
  providerId?: string
  emailVerified?: boolean
  image?: string
  preferences?: UserPreferences
  createdAt: string
  updatedAt?: string
}

export interface UserPreferences {
  savedSearches: SavedSearch[]
  favoriteCarIds: string[]
  notifications: {
    email: boolean
    sms: boolean
    priceAlerts: boolean
    newArrivals: boolean
  }
  maxPrice?: number
  preferredMakes: string[]
  preferredFuelTypes: string[]
}

export interface SavedSearch {
  id: string
  name: string
  filters: FilterOptions
  alertsEnabled: boolean
  createdAt: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "super_admin"
  createdAt: string
  lastLogin?: string
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
  carId?: string
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  carId?: string
  car?: Car
  userId?: string
  status: "new" | "contacted" | "closed"
  createdAt: string
  updatedAt: string
}

export interface FilterOptions {
  make?: string
  model?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  fuelType?: string
  transmission?: string
  bodyType?: string
}

export interface DashboardStats {
  totalCars: number
  availableCars: number
  totalUsers: number
  newInquiries: number
  totalInquiries: number
  recentInquiries: Inquiry[]
}

// NextAuth type extensions
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      image?: string
    }
  }

  interface User {
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
}
