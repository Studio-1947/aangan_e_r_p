export type Role = 'Owner' | 'Staff'

export type AuthMode = 'login' | 'signup'

export type Homestay = {
  id: string
  name: string
  ownerName: string
  contactInfo: string
  totalRooms: number
}

export type User = {
  id: string
  name: string
  email: string
  role: Role
  homestayId: string
}

export type Booking = {
  id: string
  guestName: string
  contact: string
  roomId: string
  roomLabel: string
  checkIn: string
  checkOut: string
  notes: string
}

export type InventoryItem = {
  id: string
  name: string
  currentStock: number
  minimumThreshold: number
}

export type StaffMember = {
  id: string
  name: string
  contact: string
  role: string
}

export type Room = {
  id: string
  number: string
  type: string
  maxOccupancy: number
  nightlyRate: number
  status: 'Available' | 'Occupied' | 'Maintenance'
  notes: string
}

export type Session = {
  user: User
  role: Role
  homestay: Homestay
}
