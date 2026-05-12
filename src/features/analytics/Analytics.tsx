import { useMemo } from 'react'
import { BarChart3, IndianRupee, TrendingUp, CalendarRange, ShieldAlert } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { demoBookings, demoRooms } from '../../data/mockData'

const revenueTrend = [
  { label: 'Jan', value: 48 },
  { label: 'Feb', value: 56 },
  { label: 'Mar', value: 63 },
  { label: 'Apr', value: 71 },
  { label: 'May', value: 88 },
  { label: 'Jun', value: 76 },
  { label: 'Jul', value: 92 },
  { label: 'Aug', value: 84 },
  { label: 'Sep', value: 97 },
  { label: 'Oct', value: 85 },
  { label: 'Nov', value: 101 },
  { label: 'Dec', value: 118 },
]

function MetricCard({
  icon: Icon,
  title,
  value,
  hint,
}: {
  icon: typeof BarChart3
  title: string
  value: string
  hint: string
}) {
  return (
    <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 pt-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{value}</div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 shadow-lg shadow-slate-950/20">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

export function Analytics() {
  const { user } = useAuth()

  const isOwner = user?.role === 'Owner'

  const stats = useMemo(() => {
    const monthlyRevenue = 120000
    const averageDailyRate = Math.round(monthlyRevenue / Math.max(1, demoBookings.length * 3))
    const occupancyRate = Math.round((demoBookings.length / Math.max(1, demoRooms.length)) * 100)
    const totalBookings = demoBookings.length + 16

    return { monthlyRevenue, averageDailyRate, occupancyRate, totalBookings }
  }, [])

  if (!isOwner) {
    return (
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 shadow-sm">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-400">Restricted Access</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">Analytics is owner-only</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Staff accounts can manage daily operations, but reporting and revenue analytics remain available to the property owner.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Analytics & reporting</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">Owner overview</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            A quick view of revenue, occupancy, bookings, and trend performance for the current month.
          </p>
        </div>

        <Badge className="bg-slate-950 text-white hover:bg-slate-950">Owner dashboard</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={IndianRupee}
          title="Monthly Revenue"
          value="₹1,20,000"
          hint="Projected net receipts for the current month"
        />
        <MetricCard
          icon={TrendingUp}
          title="Average Daily Rate"
          value={`₹${stats.averageDailyRate.toLocaleString('en-IN')}`}
          hint="Blended daily rate across the live room set"
        />
        <MetricCard
          icon={CalendarRange}
          title="Occupancy Rate"
          value="78%"
          hint="Rooms filled against total available inventory"
        />
        <MetricCard
          icon={BarChart3}
          title="Total Bookings"
          value={String(stats.totalBookings)}
          hint="Bookings completed this month"
        />
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Monthly trend visualization built with simple CSS bars for a light demo footprint.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid h-72 grid-cols-12 items-end gap-3 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
            {revenueTrend.map((point) => {
              return (
                <div key={point.label} className="flex h-full flex-col items-center justify-end gap-2">
                  <div className="flex w-full flex-1 items-end justify-center">
                    <div
                      className="w-full max-w-10 rounded-t-2xl bg-gradient-to-t from-slate-950 via-slate-800 to-emerald-500 shadow-lg shadow-slate-950/15"
                      style={{ height: `${Math.max(24, point.value)}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{point.label}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-950" />
              Higher bars represent stronger booking periods.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics