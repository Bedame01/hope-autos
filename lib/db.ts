import { prisma } from "./prisma"
import type { Car, Inquiry, User, DashboardStats, UserPreferences } from "./types"
import bcrypt from "bcryptjs"
import type { Prisma } from "@prisma/client"

// Authentication functions
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        preferences: {
          include: {
            savedSearches: true,
          },
        },
      },
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase() as "admin" | "customer",
      phone: user.phone ?? undefined,
      password: user.password ?? undefined,
      provider: user.provider ?? undefined,
      providerId: user.providerId ?? undefined,
      emailVerified: user.emailVerified,
      image: user.image ?? undefined,
      preferences: user.preferences
        ? {
            savedSearches: user.preferences.savedSearches.map((search) => ({
              id: search.id,
              name: search.name,
              filters: search.filters as any,
              alertsEnabled: search.alertsEnabled,
              createdAt: search.createdAt.toISOString(),
            })),
            favoriteCarIds: [], // Will be populated separately
            notifications: {
              email: user.preferences.emailNotifications,
              sms: user.preferences.smsNotifications,
              priceAlerts: user.preferences.priceAlerts,
              newArrivals: user.preferences.newArrivals,
            },
            maxPrice: user.preferences.maxPrice ?? undefined,
            preferredMakes: user.preferences.preferredMakes,
            preferredFuelTypes: user.preferences.preferredFuelTypes,
          }
        : undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        preferences: {
          include: {
            savedSearches: true,
          },
        },
      },
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase() as "admin" | "customer",
      phone: user.phone ?? undefined,
      password: user.password ?? undefined,
      provider: user.provider ?? undefined,
      providerId: user.providerId ?? undefined,
      emailVerified: user.emailVerified,
      image: user.image ?? undefined,
      preferences: user.preferences
        ? {
            savedSearches: user.preferences.savedSearches.map((search) => ({
              id: search.id,
              name: search.name,
              filters: search.filters as any,
              alertsEnabled: search.alertsEnabled,
              createdAt: search.createdAt.toISOString(),
            })),
            favoriteCarIds: [], // Will be populated separately
            notifications: {
              email: user.preferences.emailNotifications,
              sms: user.preferences.smsNotifications,
              priceAlerts: user.preferences.priceAlerts,
              newArrivals: user.preferences.newArrivals,
            },
            maxPrice: user.preferences.maxPrice ?? undefined,
            preferredMakes: user.preferences.preferredMakes,
            preferredFuelTypes: user.preferences.preferredFuelTypes,
          }
        : undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  name: string
  password?: string
  role?: "admin" | "customer"
  provider?: string
  providerId?: string
  phone?: string
}): Promise<User> {
  try {
    const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 12) : undefined

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        role: (userData.role?.toUpperCase() as "ADMIN" | "CUSTOMER") || "CUSTOMER",
        phone: userData.phone,
        password: hashedPassword,
        provider: userData.provider,
        providerId: userData.providerId,
        emailVerified: userData.provider ? true : false,
        preferences: {
          create: {
            emailNotifications: true,
            smsNotifications: false,
            priceAlerts: true,
            newArrivals: true,
            preferredMakes: [],
            preferredFuelTypes: [],
          },
        },
      },
      include: {
        preferences: {
          include: {
            savedSearches: true,
          },
        },
      },
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase() as "admin" | "customer",
      phone: user.phone ?? undefined,
      password: user.password ?? undefined,
      provider: user.provider ?? undefined,
      providerId: user.providerId ?? undefined,
      emailVerified: user.emailVerified,
      image: user.image ?? undefined,
      preferences: {
        savedSearches: [],
        favoriteCarIds: [],
        notifications: {
          email: user.preferences!.emailNotifications,
          sms: user.preferences!.smsNotifications,
          priceAlerts: user.preferences!.priceAlerts,
          newArrivals: user.preferences!.newArrivals,
        },
        maxPrice: user.preferences!.maxPrice ?? undefined,
        preferredMakes: user.preferences!.preferredMakes,
        preferredFuelTypes: user.preferences!.preferredFuelTypes,
      },
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        phone: userData.phone,
        emailVerified: userData.emailVerified,
        image: userData.image,
      },
      include: {
        preferences: {
          include: {
            savedSearches: true,
          },
        },
      },
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase() as "admin" | "customer",
      phone: user.phone,
      password: user.password,
      provider: user.provider,
      providerId: user.providerId,
      emailVerified: user.emailVerified,
      image: user.image ?? undefined,
      preferences: user.preferences
        ? {
            savedSearches: user.preferences.savedSearches.map((search) => ({
              id: search.id,
              name: search.name,
              filters: search.filters as any,
              alertsEnabled: search.alertsEnabled,
              createdAt: search.createdAt.toISOString(),
            })),
            favoriteCarIds: [],
            notifications: {
              email: user.preferences.emailNotifications,
              sms: user.preferences.smsNotifications,
              priceAlerts: user.preferences.priceAlerts,
              newArrivals: user.preferences.newArrivals,
            },
            maxPrice: user.preferences.maxPrice ?? undefined,
            preferredMakes: user.preferences.preferredMakes,
            preferredFuelTypes: user.preferences.preferredFuelTypes,
          }
        : undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

// Car functions
export async function getCars(filters?: any): Promise<Car[]> {
  try {
    const where: Prisma.CarWhereInput = {
      isAvailable: true,
    }

    if (filters) {
      if (filters.make) {
        where.make = {
          contains: filters.make,
          mode: "insensitive",
        }
      }
      if (filters.minPrice) {
        where.price = { ...where.price, gte: filters.minPrice }
      }
      if (filters.maxPrice) {
        where.price = { ...where.price, lte: filters.maxPrice }
      }
      if (filters.fuelType) {
        where.fuelType = filters.fuelType.toUpperCase()
      }
      if (filters.bodyType) {
        where.bodyType = filters.bodyType.toUpperCase()
      }
    }

    const cars = await prisma.car.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return cars.map((car) => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      color: car.color,
      fuelType: (car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase()) as any,
      transmission: (car.transmission.charAt(0) + car.transmission.slice(1).toLowerCase()) as any,
      bodyType: (car.bodyType.charAt(0) + car.bodyType.slice(1).toLowerCase()) as any,
      images: car.images,
      description: car.description,
      features: car.features,
      isAvailable: car.isAvailable,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching cars:", error)
    return []
  }
}

export async function getCarById(id: string): Promise<Car | null> {
  try {
    const car = await prisma.car.findUnique({
      where: { id },
    })

    if (!car) return null

    return {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      color: car.color,
      fuelType: (car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase()) as any,
      transmission: (car.transmission.charAt(0) + car.transmission.slice(1).toLowerCase()) as any,
      bodyType: (car.bodyType.charAt(0) + car.bodyType.slice(1).toLowerCase()) as any,
      images: car.images,
      description: car.description,
      features: car.features,
      isAvailable: car.isAvailable,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error fetching car by ID:", error)
    return null
  }
}

export async function getFeaturedCars(): Promise<Car[]> {
  try {
    const cars = await prisma.car.findMany({
      where: {
        isAvailable: true
        // isFeatured: true,
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    })

    return cars.map((car) => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      color: car.color,
      fuelType: (car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase()) as any,
      transmission: (car.transmission.charAt(0) + car.transmission.slice(1).toLowerCase()) as any,
      bodyType: (car.bodyType.charAt(0) + car.bodyType.slice(1).toLowerCase()) as any,
      images: car.images,
      description: car.description,
      features: car.features,
      isAvailable: car.isAvailable,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching featured cars:", error)
    return []
  }
}

export async function getFavoriteCarsByUserId(userId: string): Promise<Car[]> {
  try {
    const favorites = await prisma.favoriteCar.findMany({
      where: { userId },
      include: { car: true },
    })

    return favorites.map((fav) => ({
      id: fav.car.id,
      make: fav.car.make,
      model: fav.car.model,
      year: fav.car.year,
      price: fav.car.price,
      mileage: fav.car.mileage,
      color: fav.car.color,
      fuelType: (fav.car.fuelType.charAt(0) + fav.car.fuelType.slice(1).toLowerCase()) as any,
      transmission: (fav.car.transmission.charAt(0) + fav.car.transmission.slice(1).toLowerCase()) as any,
      bodyType: (fav.car.bodyType.charAt(0) + fav.car.bodyType.slice(1).toLowerCase()) as any,
      images: fav.car.images,
      description: fav.car.description,
      features: fav.car.features,
      isAvailable: fav.car.isAvailable,
      createdAt: fav.car.createdAt.toISOString(),
      updatedAt: fav.car.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching favorite cars:", error)
    return []
  }
}

export async function toggleFavoriteCar(userId: string, carId: string): Promise<boolean> {
  try {
    const existing = await prisma.favoriteCar.findUnique({
      where: {
        userId_carId: {
          userId,
          carId,
        },
      },
    })

    if (existing) {
      await prisma.favoriteCar.delete({
        where: { id: existing.id },
      })
    } else {
      await prisma.favoriteCar.create({
        data: {
          userId,
          carId,
        },
      })
    }

    return true
  } catch (error) {
    console.error("Error toggling favorite car:", error)
    return false
  }
}

// Admin functions
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [totalCars, availableCars, totalUsers, newInquiries, totalInquiries, recentInquiries] = await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { isAvailable: true } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.inquiry.count(),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { car: true },
      }),
    ])

    return {
      totalCars,
      availableCars,
      totalUsers,
      newInquiries,
      totalInquiries,
      recentInquiries: recentInquiries.map((inquiry) => ({
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
        carId: inquiry.carId,
        userId: inquiry.userId,
        status: inquiry.status.toLowerCase() as any,
        car: inquiry.car
          ? {
              id: inquiry.car.id,
              make: inquiry.car.make,
              model: inquiry.car.model,
              year: inquiry.car.year,
              price: inquiry.car.price,
              mileage: inquiry.car.mileage,
              color: inquiry.car.color,
              fuelType: (inquiry.car.fuelType.charAt(0) + inquiry.car.fuelType.slice(1).toLowerCase()) as any,
              transmission: (inquiry.car.transmission.charAt(0) +
                inquiry.car.transmission.slice(1).toLowerCase()) as any,
              bodyType: (inquiry.car.bodyType.charAt(0) + inquiry.car.bodyType.slice(1).toLowerCase()) as any,
              images: inquiry.car.images,
              description: inquiry.car.description,
              features: inquiry.car.features,
              isAvailable: inquiry.car.isAvailable,
              createdAt: inquiry.car.createdAt.toISOString(),
              updatedAt: inquiry.car.updatedAt.toISOString(),
            }
          : undefined,
        createdAt: inquiry.createdAt.toISOString(),
        updatedAt: inquiry.updatedAt.toISOString(),
      })),
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalCars: 0,
      availableCars: 0,
      totalUsers: 0,
      newInquiries: 0,
      totalInquiries: 0,
      recentInquiries: [],
    }
  }
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: { car: true },
      orderBy: { createdAt: "desc" },
    })

    return inquiries.map((inquiry) => ({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      carId: inquiry.carId,
      userId: inquiry.userId,
      status: inquiry.status.toLowerCase() as any,
      car: inquiry.car
        ? {
            id: inquiry.car.id,
            make: inquiry.car.make,
            model: inquiry.car.model,
            year: inquiry.car.year,
            price: inquiry.car.price,
            mileage: inquiry.car.mileage,
            color: inquiry.car.color,
            fuelType: (inquiry.car.fuelType.charAt(0) + inquiry.car.fuelType.slice(1).toLowerCase()) as any,
            transmission: (inquiry.car.transmission.charAt(0) + inquiry.car.transmission.slice(1).toLowerCase()) as any,
            bodyType: (inquiry.car.bodyType.charAt(0) + inquiry.car.bodyType.slice(1).toLowerCase()) as any,
            images: inquiry.car.images,
            description: inquiry.car.description,
            features: inquiry.car.features,
            isAvailable: inquiry.car.isAvailable,
            createdAt: inquiry.car.createdAt.toISOString(),
            updatedAt: inquiry.car.updatedAt.toISOString(),
          }
        : undefined,
      createdAt: inquiry.createdAt.toISOString(),
      updatedAt: inquiry.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return []
  }
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]): Promise<boolean> {
  try {
    await prisma.inquiry.update({
      where: { id },
      data: { status: status.toUpperCase() as any },
    })
    return true
  } catch (error) {
    console.error("Error updating inquiry status:", error)
    return false
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      include: {
        preferences: {
          include: {
            savedSearches: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase() as "admin" | "customer",
      phone: user.phone,
      password: user.password,
      provider: user.provider,
      providerId: user.providerId,
      emailVerified: user.emailVerified,
      image: user.image,
      preferences: user.preferences
        ? {
            savedSearches: user.preferences.savedSearches.map((search) => ({
              id: search.id,
              name: search.name,
              filters: search.filters as any,
              alertsEnabled: search.alertsEnabled,
              createdAt: search.createdAt.toISOString(),
            })),
            favoriteCarIds: [],
            notifications: {
              email: user.preferences.emailNotifications,
              sms: user.preferences.smsNotifications,
              priceAlerts: user.preferences.priceAlerts,
              newArrivals: user.preferences.newArrivals,
            },
            maxPrice: user.preferences.maxPrice ?? undefined,
            preferredMakes: user.preferences.preferredMakes,
            preferredFuelTypes: user.preferences.preferredFuelTypes,
          }
        : undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function addCar(carData: Omit<Car, "id" | "createdAt" | "updatedAt">): Promise<Car> {
  try {
    const car = await prisma.car.create({
      data: {
        make: carData.make,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        mileage: carData.mileage,
        color: carData.color,
        fuelType: carData.fuelType.toUpperCase() as any,
        transmission: carData.transmission.toUpperCase() as any,
        bodyType: carData.bodyType.toUpperCase() as any,
        images: carData.images,
        description: carData.description,
        features: carData.features,
        isAvailable: carData.isAvailable,
      },
    })

    return {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      color: car.color,
      fuelType: (car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase()) as any,
      transmission: (car.transmission.charAt(0) + car.transmission.slice(1).toLowerCase()) as any,
      bodyType: (car.bodyType.charAt(0) + car.bodyType.slice(1).toLowerCase()) as any,
      images: car.images,
      description: car.description,
      features: car.features,
      isAvailable: car.isAvailable,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error adding car:", error)
    throw new Error("Failed to add car")
  }
}

export async function updateCar(id: string, carData: Partial<Car>): Promise<Car | null> {
  try {
    const car = await prisma.car.update({
      where: { id },
      data: {
        make: carData.make,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        mileage: carData.mileage,
        color: carData.color,
        fuelType: carData.fuelType?.toUpperCase() as any,
        transmission: carData.transmission?.toUpperCase() as any,
        bodyType: carData.bodyType?.toUpperCase() as any,
        images: carData.images,
        description: carData.description,
        features: carData.features,
        isAvailable: carData.isAvailable,
      },
    })

    return {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      color: car.color,
      fuelType: (car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase()) as any,
      transmission: (car.transmission.charAt(0) + car.transmission.slice(1).toLowerCase()) as any,
      bodyType: (car.bodyType.charAt(0) + car.bodyType.slice(1).toLowerCase()) as any,
      images: car.images,
      description: car.description,
      features: car.features,
      isAvailable: car.isAvailable,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error updating car:", error)
    return null
  }
}

export async function deleteCar(id: string): Promise<boolean> {
  try {
    await prisma.car.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error("Error deleting car:", error)
    return false
  }
}

// Contact/Inquiry functions
export async function createInquiry(inquiryData: {
  name: string
  email: string
  phone?: string
  message: string
  carId?: string
  userId?: string
}): Promise<Inquiry> {
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone,
        message: inquiryData.message,
        carId: inquiryData.carId,
        userId: inquiryData.userId,
        status: "NEW",
      },
      include: { car: true },
    })

    return {
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      carId: inquiry.carId,
      userId: inquiry.userId,
      status: inquiry.status.toLowerCase() as any,
      car: inquiry.car
        ? {
            id: inquiry.car.id,
            make: inquiry.car.make,
            model: inquiry.car.model,
            year: inquiry.car.year,
            price: inquiry.car.price,
            mileage: inquiry.car.mileage,
            color: inquiry.car.color,
            fuelType: (inquiry.car.fuelType.charAt(0) + inquiry.car.fuelType.slice(1).toLowerCase()) as any,
            transmission: (inquiry.car.transmission.charAt(0) + inquiry.car.transmission.slice(1).toLowerCase()) as any,
            bodyType: (inquiry.car.bodyType.charAt(0) + inquiry.car.bodyType.slice(1).toLowerCase()) as any,
            images: inquiry.car.images,
            description: inquiry.car.description,
            features: inquiry.car.features,
            isAvailable: inquiry.car.isAvailable,
            createdAt: inquiry.car.createdAt.toISOString(),
            updatedAt: inquiry.car.updatedAt.toISOString(),
          }
        : undefined,
      createdAt: inquiry.createdAt.toISOString(),
      updatedAt: inquiry.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error creating inquiry:", error)
    throw new Error("Failed to create inquiry")
  }
}

export async function updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<boolean> {
  try {
    await prisma.userPreferences.upsert({
      where: { userId },
      update: {
        maxPrice: preferences.maxPrice,
        preferredMakes: preferences.preferredMakes,
        preferredFuelTypes: preferences.preferredFuelTypes,
        emailNotifications: preferences.notifications?.email,
        smsNotifications: preferences.notifications?.sms,
        priceAlerts: preferences.notifications?.priceAlerts,
        newArrivals: preferences.notifications?.newArrivals,
      },
      create: {
        userId,
        maxPrice: preferences.maxPrice,
        preferredMakes: preferences.preferredMakes || [],
        preferredFuelTypes: preferences.preferredFuelTypes || [],
        emailNotifications: preferences.notifications?.email ?? true,
        smsNotifications: preferences.notifications?.sms ?? false,
        priceAlerts: preferences.notifications?.priceAlerts ?? true,
        newArrivals: preferences.notifications?.newArrivals ?? true,
      },
    })
    return true
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return false
  }
}
