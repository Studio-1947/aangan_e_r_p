import type {
  Booking,
  Homestay,
  InventoryItem,
  Room,
  StaffMember,
  User,
} from '../types'

export const demoHomestay: Homestay = {
  id: 'hs-demo-001',
  name: 'Seabreeze Homestay',
  ownerName: 'Aarav Mehta',
  contactInfo: '+91 98765 43210 · hello@seabreeze.demo',
  totalRooms: 12,
}

export const demoUser: User = {
  id: 'user-demo-owner',
  name: 'Demo Superuser',
  email: 'owner@seabreeze.demo',
  role: 'Owner',
  homestayId: demoHomestay.id,
}

export const demoUsers: User[] = [
  demoUser,
  {
    id: 'user-demo-staff',
    name: 'Front Desk Staff',
    email: 'staff@seabreeze.demo',
    role: 'Staff',
    homestayId: demoHomestay.id,
  },
]

export const demoBookings: Booking[] = [
  {
    id: 'bk-101',
    guestName: 'Karan Verma',
    contact: '+91 90000 10001',
    roomId: 'room-101',
    roomLabel: '101',
    checkIn: '2026-05-04',
    checkOut: '2026-05-06',
    notes: 'Late check-in, airport transfer requested.',
  },
  {
    id: 'bk-103',
    guestName: 'Maya Iyer',
    contact: '+91 90000 10003',
    roomId: 'room-103',
    roomLabel: '103',
    checkIn: '2026-05-05',
    checkOut: '2026-05-08',
    notes: 'Vegetarian breakfast preference.',
  },
  {
    id: 'bk-201',
    guestName: 'Nikhil Rao',
    contact: '+91 90000 10007',
    roomId: 'room-201',
    roomLabel: '201',
    checkIn: '2026-05-06',
    checkOut: '2026-05-09',
    notes: 'Family stay with child crib.',
  },
  {
    id: 'bk-202',
    guestName: 'Sara Khan',
    contact: '+91 90000 10008',
    roomId: 'room-202',
    roomLabel: '202',
    checkIn: '2026-05-07',
    checkOut: '2026-05-10',
    notes: 'Business trip, invoice on checkout.',
  },
]

export const demoInventory: InventoryItem[] = [
  { id: 'inv-blankets', name: 'Extra Blankets', currentStock: 14, minimumThreshold: 8 },
  { id: 'inv-heaters', name: 'Room Heaters', currentStock: 4, minimumThreshold: 5 },
  { id: 'inv-tea', name: 'Local Tea/Coffee', currentStock: 26, minimumThreshold: 12 },
  { id: 'inv-toiletries', name: 'Toiletries', currentStock: 9, minimumThreshold: 15 },
]

export const demoStaff: StaffMember[] = [
  { id: 'staff-1', name: 'Anita Bose', contact: '+91 90001 11221', role: 'Housekeeping' },
  { id: 'staff-2', name: 'Imran Shaikh', contact: '+91 90001 11222', role: 'Kitchen' },
  { id: 'staff-3', name: 'Ritika Das', contact: '+91 90001 11223', role: 'Manager' },
]

export const demoRooms: Room[] = [
  {
    id: 'room-101',
    number: '101',
    type: 'Garden View King',
    maxOccupancy: 2,
    nightlyRate: 5400,
    status: 'Occupied',
    notes: 'Balcony facing the inner garden.',
  },
  {
    id: 'room-102',
    number: '102',
    type: 'Twin Comfort',
    maxOccupancy: 2,
    nightlyRate: 4200,
    status: 'Available',
    notes: 'Flexible setup for business or family stays.',
  },
  {
    id: 'room-103',
    number: '103',
    type: 'Deluxe Family',
    maxOccupancy: 4,
    nightlyRate: 6800,
    status: 'Occupied',
    notes: 'Extra bedding available on request.',
  },
  {
    id: 'room-201',
    number: '201',
    type: 'Sea Breeze Suite',
    maxOccupancy: 3,
    nightlyRate: 8200,
    status: 'Occupied',
    notes: 'Premium floor with terrace seating.',
  },
  {
    id: 'room-202',
    number: '202',
    type: 'Compact Studio',
    maxOccupancy: 2,
    nightlyRate: 3600,
    status: 'Maintenance',
    notes: 'AC service scheduled this afternoon.',
  },
  {
    id: 'room-203',
    number: '203',
    type: 'Courtyard Loft',
    maxOccupancy: 2,
    nightlyRate: 4950,
    status: 'Available',
    notes: 'Quiet room with extended workspace.',
  },
]
