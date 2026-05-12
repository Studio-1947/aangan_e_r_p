import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Textarea } from '../../components/ui/textarea'
import { demoRooms } from '../../data/mockData'

type FrontDeskGuest = {
  id: string
  guestName: string
  roomId: string
  roomLabel: string
  contact: string
  pendingBalance: number
  checkInTime?: string
  dietaryHint?: string
  status?: 'Arriving' | 'Departing'
}

type CheckInForm = {
  contact: string
  dietaryNotes: string
}

const operationalDay = format(new Date(), 'yyyy-MM-dd')

const todayArrivals: FrontDeskGuest[] = [
  {
    id: 'arrival-1',
    guestName: 'Maya Iyer',
    roomId: 'room-103',
    roomLabel: '103',
    contact: '+91 90000 10003',
    pendingBalance: 0,
    checkInTime: '12:30 PM',
    status: 'Arriving',
  },
  {
    id: 'arrival-2',
    guestName: 'Ananya Sharma',
    roomId: 'room-102',
    roomLabel: '102',
    contact: '+91 90000 10022',
    pendingBalance: 0,
    checkInTime: '03:00 PM',
    status: 'Arriving',
  },
]

const todayDepartures: FrontDeskGuest[] = [
  {
    id: 'departure-1',
    guestName: 'Karan Verma',
    roomId: 'room-101',
    roomLabel: '101',
    contact: '+91 90000 10001',
    pendingBalance: 1850,
    status: 'Departing',
  },
  {
    id: 'departure-2',
    guestName: 'Nikhil Rao',
    roomId: 'room-201',
    roomLabel: '201',
    contact: '+91 90000 10007',
    pendingBalance: 420,
    status: 'Departing',
  },
]

function currency(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function FrontDesk() {
  const [arrivals, setArrivals] = useState(todayArrivals)
  const [checkedInIds, setCheckedInIds] = useState<string[]>([])
  const [checkOutNote, setCheckOutNote] = useState<string | null>(null)
  const [activeGuest, setActiveGuest] = useState<FrontDeskGuest | null>(null)
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [form, setForm] = useState<CheckInForm>({ contact: '', dietaryNotes: '' })

  const arrivalsWithStatus = useMemo(
    () => arrivals.map((guest) => ({ ...guest, checkedIn: checkedInIds.includes(guest.id) })),
    [arrivals, checkedInIds],
  )

  function openCheckIn(guest: FrontDeskGuest) {
    setActiveGuest(guest)
    setForm({ contact: guest.contact, dietaryNotes: '' })
    setCheckInOpen(true)
  }

  function completeCheckIn() {
    if (!activeGuest) {
      return
    }

    setCheckedInIds((current) => [...current, activeGuest.id])
    setArrivals((current) => current.filter((guest) => guest.id !== activeGuest.id))
    setCheckInOpen(false)
    setActiveGuest(null)
  }

  function settleAndCheckout(guest: FrontDeskGuest) {
    setCheckOutNote(`${guest.guestName} · Room ${guest.roomLabel} would be routed to Billing & Folio for settlement.`)
  }

  const roomLabelById = useMemo(() => {
    return new Map(demoRooms.map((room) => [room.id, room.number]))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Front desk</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">Today's operations</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Daily arrivals, check-ins, and departures for {operationalDay}.</p>
        </div>

        <Badge variant="outline">Live operations</Badge>
      </div>

      {checkOutNote ? (
        <div className="rounded-3xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-sm text-amber-900 dark:text-amber-300">
          {checkOutNote}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
            <CardTitle>Today's Arrivals</CardTitle>
            <CardDescription>Guests expected to complete digital check-in at the front desk.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Room Assigned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {arrivalsWithStatus.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      <div className="font-medium text-slate-950 dark:text-slate-50">{guest.guestName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">ETA {guest.checkInTime}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-950 dark:text-slate-50">Room {roomLabelById.get(guest.roomId) ?? guest.roomLabel}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{guest.contact}</div>
                    </TableCell>
                    <TableCell>
                      {guest.checkedIn ? <Badge variant="success">Checked In</Badge> : <Badge variant="warning">Pending</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant={guest.checkedIn ? 'outline' : 'default'} onClick={() => openCheckIn(guest)} disabled={guest.checkedIn}>
                        Check-In
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
            <CardTitle>Today's Departures</CardTitle>
            <CardDescription>Guests checking out today with any pending balance shown for settlement.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Pending Balance</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayDepartures.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      <div className="font-medium text-slate-950 dark:text-slate-50">{guest.guestName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{guest.contact}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-950 dark:text-slate-50">Room {guest.roomLabel}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Checkout today</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={guest.pendingBalance > 0 ? 'warning' : 'success'}>
                        {guest.pendingBalance > 0 ? currency(guest.pendingBalance) : 'Settled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" onClick={() => settleAndCheckout(guest)}>
                        Settle & Checkout
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Digital Check-In</DialogTitle>
            <DialogDescription>
              Complete arrival verification for {activeGuest?.guestName ?? 'the selected guest'}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="guest-id-upload">
                Guest ID Verification
              </label>
              <Input id="guest-id-upload" type="file" accept="image/*,.pdf" />
              <p className="text-xs text-slate-500">Upload a scanned ID or photo for front desk verification.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="contact-confirmation">
                Contact Details Confirmation
              </label>
              <Input
                id="contact-confirmation"
                value={form.contact}
                onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))}
                placeholder="Guest contact number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="dietary-notes">
                Dietary Preferences / Special Requests
              </label>
              <Textarea
                id="dietary-notes"
                value={form.dietaryNotes}
                onChange={(event) => setForm((current) => ({ ...current, dietaryNotes: event.target.value }))}
                placeholder="Vegetarian meals, allergy notes, late breakfast, luggage assistance..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setCheckInOpen(false)}>
              Cancel
            </Button>
            <Button onClick={completeCheckIn}>Complete Check-In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FrontDesk