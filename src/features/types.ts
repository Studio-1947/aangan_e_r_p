import type { LucideIcon } from 'lucide-react'
import type { AuthMode, Booking, Homestay, InventoryItem, Role, Room, StaffMember, User } from '../types'

export type SessionState = {
  user: User
  role: Role
  homestay: Homestay
}

export type BookingDraft = {
  guestName: string
  contact: string
  roomId: string
  checkIn: string
  checkOut: string
  notes: string
}

export type StaffDraft = {
  name: string
  contact: string
  role: string
}

export type SignupDraft = {
  homestayName: string
  ownerName: string
  contactInfo: string
  totalRooms: string
}

export type InventoryDraft = {
  currentStock: string
}

export type NavTab = {
  value: string
  label: string
  icon: LucideIcon
}

export type FeatureAuthMode = AuthMode
export type FeatureBooking = Booking
export type FeatureHomestay = Homestay
export type FeatureInventoryItem = InventoryItem
export type FeatureRole = Role
export type FeatureRoom = Room
export type FeatureStaffMember = StaffMember
