"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "es" | "fr" | "de" | "zh"
type Currency = "USD" | "NGN"

interface LanguageContextType {
  language: Language
  currency: Currency
  setLanguage: (lang: Language) => void
  setCurrency: (curr: Currency) => void
  t: (key: string) => string
  formatPrice: (price: number) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Translation data
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.inventory": "Inventory",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.signin": "Sign In",
    "nav.signup": "Sign Up",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin Panel",
    "nav.favorites": "Favorites",
    "nav.settings": "Settings",
    "nav.signout": "Sign Out",

    // Common
    "common.loading": "Loading...",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.clear": "Clear",
    "common.apply": "Apply",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.add": "Add",
    "common.remove": "Remove",
    "common.yes": "Yes",
    "common.no": "No",
    "common.any": "Any",

    // Car details
    "car.year": "Year",
    "car.make": "Make",
    "car.model": "Model",
    "car.price": "Price",
    "car.mileage": "Mileage",
    "car.color": "Color",
    "car.fuel": "Fuel Type",
    "car.transmission": "Transmission",
    "car.body": "Body Type",
    "car.features": "Features",
    "car.description": "Description",
    "car.available": "Available",
    "car.sold": "Sold",
    "car.views": "views",

    // Actions
    "action.viewDetails": "View Details",
    "action.contact": "Contact",
    "action.requestInfo": "Request Information",
    "action.call": "Call",
    "action.share": "Share",
    "action.favorite": "Add to Favorites",

    // Forms
    "form.name": "Name",
    "form.email": "Email",
    "form.phone": "Phone",
    "form.message": "Message",
    "form.submit": "Submit",
    "form.required": "Required",

    // Admin
    "admin.dashboard": "Admin Dashboard",
    "admin.cars": "Manage Cars",
    "admin.users": "Manage Users",
    "admin.inquiries": "Inquiries",
    "admin.settings": "Settings",
    "admin.addCar": "Add New Car",
    "admin.editCar": "Edit Car",
    "admin.totalCars": "Total Cars",
    "admin.availableCars": "Available Cars",
    "admin.totalUsers": "Total Users",
    "admin.newInquiries": "New Inquiries",

    // Settings
    "settings.language": "Language",
    "settings.currency": "Currency",
    "settings.theme": "Theme",
    "settings.notifications": "Notifications",
    "settings.privacy": "Privacy",

    // Messages
    "message.success": "Success!",
    "message.error": "Error occurred",
    "message.noResults": "No results found",
    "message.loading": "Loading...",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.inventory": "Inventario",
    "nav.about": "Acerca de",
    "nav.contact": "Contacto",
    "nav.signin": "Iniciar Sesión",
    "nav.signup": "Registrarse",
    "nav.dashboard": "Panel",
    "nav.admin": "Panel Admin",
    "nav.favorites": "Favoritos",
    "nav.settings": "Configuración",
    "nav.signout": "Cerrar Sesión",

    // Common
    "common.loading": "Cargando...",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.clear": "Limpiar",
    "common.apply": "Aplicar",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.view": "Ver",
    "common.add": "Agregar",
    "common.remove": "Quitar",
    "common.yes": "Sí",
    "common.no": "No",
    "common.any": "Cualquiera",

    // Car details
    "car.year": "Año",
    "car.make": "Marca",
    "car.model": "Modelo",
    "car.price": "Precio",
    "car.mileage": "Kilometraje",
    "car.color": "Color",
    "car.fuel": "Combustible",
    "car.transmission": "Transmisión",
    "car.body": "Carrocería",
    "car.features": "Características",
    "car.description": "Descripción",
    "car.available": "Disponible",
    "car.sold": "Vendido",
    "car.views": "vistas",

    // Actions
    "action.viewDetails": "Ver Detalles",
    "action.contact": "Contactar",
    "action.requestInfo": "Solicitar Información",
    "action.call": "Llamar",
    "action.share": "Compartir",
    "action.favorite": "Agregar a Favoritos",

    // Forms
    "form.name": "Nombre",
    "form.email": "Correo",
    "form.phone": "Teléfono",
    "form.message": "Mensaje",
    "form.submit": "Enviar",
    "form.required": "Requerido",

    // Admin
    "admin.dashboard": "Panel Administrativo",
    "admin.cars": "Gestionar Autos",
    "admin.users": "Gestionar Usuarios",
    "admin.inquiries": "Consultas",
    "admin.settings": "Configuración",
    "admin.addCar": "Agregar Auto",
    "admin.editCar": "Editar Auto",
    "admin.totalCars": "Total de Autos",
    "admin.availableCars": "Autos Disponibles",
    "admin.totalUsers": "Total de Usuarios",
    "admin.newInquiries": "Nuevas Consultas",

    // Settings
    "settings.language": "Idioma",
    "settings.currency": "Moneda",
    "settings.theme": "Tema",
    "settings.notifications": "Notificaciones",
    "settings.privacy": "Privacidad",

    // Messages
    "message.success": "¡Éxito!",
    "message.error": "Ocurrió un error",
    "message.noResults": "No se encontraron resultados",
    "message.loading": "Cargando...",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.inventory": "Inventaire",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.signin": "Se connecter",
    "nav.signup": "S'inscrire",
    "nav.dashboard": "Tableau de bord",
    "nav.admin": "Panel Admin",
    "nav.favorites": "Favoris",
    "nav.settings": "Paramètres",
    "nav.signout": "Se déconnecter",

    // Common
    "common.loading": "Chargement...",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.clear": "Effacer",
    "common.apply": "Appliquer",
    "common.save": "Sauvegarder",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.view": "Voir",
    "common.add": "Ajouter",
    "common.remove": "Retirer",
    "common.yes": "Oui",
    "common.no": "Non",
    "common.any": "Tout",

    // Car details
    "car.year": "Année",
    "car.make": "Marque",
    "car.model": "Modèle",
    "car.price": "Prix",
    "car.mileage": "Kilométrage",
    "car.color": "Couleur",
    "car.fuel": "Carburant",
    "car.transmission": "Transmission",
    "car.body": "Carrosserie",
    "car.features": "Caractéristiques",
    "car.description": "Description",
    "car.available": "Disponible",
    "car.sold": "Vendu",
    "car.views": "vues",

    // Actions
    "action.viewDetails": "Voir les détails",
    "action.contact": "Contacter",
    "action.requestInfo": "Demander des informations",
    "action.call": "Appeler",
    "action.share": "Partager",
    "action.favorite": "Ajouter aux favoris",

    // Forms
    "form.name": "Nom",
    "form.email": "Email",
    "form.phone": "Téléphone",
    "form.message": "Message",
    "form.submit": "Soumettre",
    "form.required": "Requis",

    // Admin
    "admin.dashboard": "Tableau de bord Admin",
    "admin.cars": "Gérer les voitures",
    "admin.users": "Gérer les utilisateurs",
    "admin.inquiries": "Demandes",
    "admin.settings": "Paramètres",
    "admin.addCar": "Ajouter une voiture",
    "admin.editCar": "Modifier la voiture",
    "admin.totalCars": "Total des voitures",
    "admin.availableCars": "Voitures disponibles",
    "admin.totalUsers": "Total des utilisateurs",
    "admin.newInquiries": "Nouvelles demandes",

    // Settings
    "settings.language": "Langue",
    "settings.currency": "Devise",
    "settings.theme": "Thème",
    "settings.notifications": "Notifications",
    "settings.privacy": "Confidentialité",

    // Messages
    "message.success": "Succès!",
    "message.error": "Une erreur s'est produite",
    "message.noResults": "Aucun résultat trouvé",
    "message.loading": "Chargement...",
  },
  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.inventory": "Inventar",
    "nav.about": "Über uns",
    "nav.contact": "Kontakt",
    "nav.signin": "Anmelden",
    "nav.signup": "Registrieren",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin Panel",
    "nav.favorites": "Favoriten",
    "nav.settings": "Einstellungen",
    "nav.signout": "Abmelden",

    // Common
    "common.loading": "Laden...",
    "common.search": "Suchen",
    "common.filter": "Filter",
    "common.clear": "Löschen",
    "common.apply": "Anwenden",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.view": "Ansehen",
    "common.add": "Hinzufügen",
    "common.remove": "Entfernen",
    "common.yes": "Ja",
    "common.no": "Nein",
    "common.any": "Beliebig",

    // Car details
    "car.year": "Jahr",
    "car.make": "Marke",
    "car.model": "Modell",
    "car.price": "Preis",
    "car.mileage": "Laufleistung",
    "car.color": "Farbe",
    "car.fuel": "Kraftstoff",
    "car.transmission": "Getriebe",
    "car.body": "Karosserie",
    "car.features": "Ausstattung",
    "car.description": "Beschreibung",
    "car.available": "Verfügbar",
    "car.sold": "Verkauft",
    "car.views": "Aufrufe",

    // Actions
    "action.viewDetails": "Details ansehen",
    "action.contact": "Kontakt",
    "action.requestInfo": "Informationen anfordern",
    "action.call": "Anrufen",
    "action.share": "Teilen",
    "action.favorite": "Zu Favoriten hinzufügen",

    // Forms
    "form.name": "Name",
    "form.email": "E-Mail",
    "form.phone": "Telefon",
    "form.message": "Nachricht",
    "form.submit": "Senden",
    "form.required": "Erforderlich",

    // Admin
    "admin.dashboard": "Admin Dashboard",
    "admin.cars": "Autos verwalten",
    "admin.users": "Benutzer verwalten",
    "admin.inquiries": "Anfragen",
    "admin.settings": "Einstellungen",
    "admin.addCar": "Auto hinzufügen",
    "admin.editCar": "Auto bearbeiten",
    "admin.totalCars": "Autos gesamt",
    "admin.availableCars": "Verfügbare Autos",
    "admin.totalUsers": "Benutzer gesamt",
    "admin.newInquiries": "Neue Anfragen",

    // Settings
    "settings.language": "Sprache",
    "settings.currency": "Währung",
    "settings.theme": "Design",
    "settings.notifications": "Benachrichtigungen",
    "settings.privacy": "Datenschutz",

    // Messages
    "message.success": "Erfolgreich!",
    "message.error": "Fehler aufgetreten",
    "message.noResults": "Keine Ergebnisse gefunden",
    "message.loading": "Laden...",
  },
  zh: {
    // Navigation
    "nav.home": "首页",
    "nav.inventory": "库存",
    "nav.about": "关于我们",
    "nav.contact": "联系我们",
    "nav.signin": "登录",
    "nav.signup": "注册",
    "nav.dashboard": "仪表板",
    "nav.admin": "管理面板",
    "nav.favorites": "收藏",
    "nav.settings": "设置",
    "nav.signout": "退出",

    // Common
    "common.loading": "加载中...",
    "common.search": "搜索",
    "common.filter": "筛选",
    "common.clear": "清除",
    "common.apply": "应用",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.delete": "删除",
    "common.edit": "编辑",
    "common.view": "查看",
    "common.add": "添加",
    "common.remove": "移除",
    "common.yes": "是",
    "common.no": "否",
    "common.any": "任意",

    // Car details
    "car.year": "年份",
    "car.make": "品牌",
    "car.model": "型号",
    "car.price": "价格",
    "car.mileage": "里程",
    "car.color": "颜色",
    "car.fuel": "燃料类型",
    "car.transmission": "变速箱",
    "car.body": "车身类型",
    "car.features": "特性",
    "car.description": "描述",
    "car.available": "可用",
    "car.sold": "已售",
    "car.views": "浏览",

    // Actions
    "action.viewDetails": "查看详情",
    "action.contact": "联系",
    "action.requestInfo": "请求信息",
    "action.call": "致电",
    "action.share": "分享",
    "action.favorite": "添加到收藏",

    // Forms
    "form.name": "姓名",
    "form.email": "邮箱",
    "form.phone": "电话",
    "form.message": "消息",
    "form.submit": "提交",
    "form.required": "必填",

    // Admin
    "admin.dashboard": "管理仪表板",
    "admin.cars": "管理汽车",
    "admin.users": "管理用户",
    "admin.inquiries": "询问",
    "admin.settings": "设置",
    "admin.addCar": "添加汽车",
    "admin.editCar": "编辑汽车",
    "admin.totalCars": "汽车总数",
    "admin.availableCars": "可用汽车",
    "admin.totalUsers": "用户总数",
    "admin.newInquiries": "新询问",

    // Settings
    "settings.language": "语言",
    "settings.currency": "货币",
    "settings.theme": "主题",
    "settings.notifications": "通知",
    "settings.privacy": "隐私",

    // Messages
    "message.success": "成功！",
    "message.error": "发生错误",
    "message.noResults": "未找到结果",
    "message.loading": "加载中...",
  },
}

const currencySymbols = {
  USD: "$",
  NGN: "₦",
}

const currencyRates = {
  USD: 1,
  NGN: 1650, // 1 USD = 1650 NGN (approximate rate)
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")
  const [currency, setCurrency] = useState<Currency>("USD")

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    const savedCurrency = localStorage.getItem("currency") as Currency

    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
    if (savedCurrency && currencySymbols[savedCurrency]) {
      setCurrency(savedCurrency)
    }
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  useEffect(() => {
    localStorage.setItem("currency", currency)
  }, [currency])

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const formatPrice = (price: number): string => {
    const convertedPrice = currency === "NGN" ? price * currencyRates.NGN : price
    const symbol = currencySymbols[currency]

    return `${symbol}${convertedPrice.toLocaleString()}`
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        currency,
        setLanguage,
        setCurrency,
        t,
        formatPrice,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
