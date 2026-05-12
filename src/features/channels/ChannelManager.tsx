import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Switch } from '../../components/ui/switch'
import { Building2, Globe2, Link2, Send, Sparkles } from 'lucide-react'

const platforms = [
  {
    name: 'MakeMyTrip',
    description: 'Sync calendar availability and guest messages automatically.',
    icon: Globe2,
  },
  {
    name: 'Agoda',
    description: 'Keep rates and stay dates aligned across booking channels.',
    icon: Link2,
  },
  {
    name: 'Booking.com',
    description: 'Prepare live OTA connectivity for room inventory updates.',
    icon: Send,
  },
  {
    name: 'Airbnb',
    description: 'Coordinate reservation syncs and availability blocks in one place.',
    icon: Building2,
  },
]

function PlatformCard({ name, description, icon: Icon }: { name: string; description: string; icon: typeof Globe2 }) {
  return (
    <Card className="border-slate-200/80 bg-white/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader className="space-y-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-md shadow-slate-950/20">
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="outline">Coming Soon</Badge>
        </div>
        <div>
          <CardTitle className="text-xl tracking-tight text-slate-950">{name}</CardTitle>
          <CardDescription className="mt-1 text-sm text-slate-500">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-950">Channel sync</p>
            <p className="text-xs text-slate-500">Auto-connect once the integration is ready.</p>
          </div>
          <Switch checked={false} disabled />
        </div>

        <Button variant="outline" className="w-full" disabled>
          <Sparkles className="h-4 w-4" />
          Connect
        </Button>
      </CardContent>
    </Card>
  )
}

export function ChannelManager() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Multi-channel booking manager</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Channel Manager</h2>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Coming Soon</Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            OTA synchronisation is not live yet, but this panel previews how calendar blocks, messages, and availability will
            eventually be managed from one place.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-slate-950">Master Auto-Sync</p>
              <p className="text-xs text-slate-500">Global control for all connected booking channels.</p>
            </div>
            <Switch checked={false} disabled />
          </div>
          <p className="mt-3 text-xs text-slate-500">Disabled until the integration layer is ready.</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {platforms.map((platform) => (
          <PlatformCard key={platform.name} name={platform.name} description={platform.description} icon={platform.icon} />
        ))}
      </div>
    </div>
  )
}

export default ChannelManager