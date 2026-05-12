import { useMemo, useState } from "react";
import {
  ChevronDown,
  Minus,
  Plus,
  ReceiptText,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Select } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export type MenuCategory = "Beverages" | "Food" | "Services";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
};

export type CartItem = MenuItem & {
  quantity: number;
};

export type GuestOption = {
  id: string;
  name: string;
  roomLabel: string;
};

export const menuData: Record<MenuCategory, MenuItem[]> = {
  Beverages: [
    {
      id: "bev-darjeeling-tea",
      name: "Darjeeling Tea",
      price: 80,
      category: "Beverages",
    },
    {
      id: "bev-coffee",
      name: "Coffee",
      price: 90,
      category: "Beverages",
    },
    {
      id: "bev-masala-chai",
      name: "Masala Chai",
      price: 70,
      category: "Beverages",
    },
  ],
  Food: [
    {
      id: "food-local-thali",
      name: "Local Thali",
      price: 280,
      category: "Food",
    },
    {
      id: "food-momos",
      name: "Momos",
      price: 180,
      category: "Food",
    },
    {
      id: "food-sandwiches",
      name: "Sandwiches",
      price: 160,
      category: "Food",
    },
  ],
  Services: [
    {
      id: "service-laundry",
      name: "Laundry",
      price: 250,
      category: "Services",
    },
    {
      id: "service-firewood",
      name: "Firewood",
      price: 200,
      category: "Services",
    },
  ],
};

export const mockGuestOptions: GuestOption[] = [
  { id: "guest-101", name: "Karan Verma", roomLabel: "101" },
  { id: "guest-103", name: "Maya Iyer", roomLabel: "103" },
  { id: "guest-201", name: "Nikhil Rao", roomLabel: "201" },
  { id: "guest-202", name: "Sara Khan", roomLabel: "202" },
];

export function KitchenPOS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedGuest, setSelectedGuest] = useState(
    mockGuestOptions[0]?.id ?? "",
  );
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("Beverages");
  const [postedChargeMessage, setPostedChargeMessage] = useState<string | null>(null);

  const selectedGuestDetails = useMemo(
    () => mockGuestOptions.find((guest) => guest.id === selectedGuest) ?? null,
    [selectedGuest],
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const addMenuItem = (item: MenuItem) => {
    setCart((current) => {
      const existingItem = current.find((entry) => entry.id === item.id);

      if (existingItem) {
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  };

  const changeQuantity = (itemId: string, delta: number) => {
    setCart((current) =>
      current
        .map((entry) =>
          entry.id === itemId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  };

  const postCharge = () => {
    if (!cart.length || !selectedGuestDetails) {
      return;
    }

    setPostedChargeMessage(
      `Posted ₹${cartTotal.toLocaleString("en-IN")} to ${selectedGuestDetails.name}'s room.`,
    );
    setCart([]);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.9fr)]">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Kitchen & Services POS</CardTitle>
              <CardDescription>
                Add items to a guest's folio and keep the ticket ready for billing.
              </CardDescription>
            </div>
          </div>

          <Tabs
            defaultValue="Beverages"
            value={activeCategory}
            onValueChange={(value) => setActiveCategory(value as MenuCategory)}
          >
            <TabsList className="flex w-fit flex-wrap gap-2 bg-transparent p-0">
              {Object.keys(menuData).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(menuData).map(([category, items]) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="group cursor-pointer border-slate-200 dark:border-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md"
                      onClick={() => addMenuItem(item)}
                    >
                      <CardContent className="flex items-center justify-between gap-3 p-4">
                        <div>
                          <h3 className="font-semibold text-slate-950 dark:text-slate-50">{item.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Tap to add to cart</p>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          ₹{item.price.toLocaleString("en-IN")}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardHeader>
      </Card>

      <Card className="sticky top-6 h-fit overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/60 dark:shadow-slate-950/20">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-white">Current Ticket</CardTitle>
              <CardDescription className="text-slate-300 dark:text-slate-400">
                Select the guest before posting a charge.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5">
          {postedChargeMessage ? (
            <div
              className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300"
              aria-live="polite"
            >
              {postedChargeMessage}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Guest</label>
            <div className="relative">
              <Select
                value={selectedGuest}
                onChange={(event) => setSelectedGuest(event.target.value)}
                className="pr-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              >
                {mockGuestOptions.map((guest) => (
                  <option key={guest.id} value={guest.id}>
                    {guest.name} - Room {guest.roomLabel}
                  </option>
                ))}
              </Select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
            {selectedGuestDetails ? (
              <>
                Billing to <span className="font-semibold text-slate-950 dark:text-slate-100">{selectedGuestDetails.name}</span> in room {selectedGuestDetails.roomLabel}.
              </>
            ) : (
              "Choose a checked-in guest to continue."
            )}
          </div>

          <ScrollArea className="max-h-[420px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="space-y-3 p-3">
              {cart.length === 0 ? (
                <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  No items added yet. Tap a menu card to build the ticket.
                </div>
              ) : (
                cart.map((item) => {
                  const lineTotal = item.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-slate-950 dark:text-slate-50">{item.name}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            ₹{item.price.toLocaleString("en-IN")} each
                          </p>
                        </div>
                        <Badge>{item.category}</Badge>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full"
                            onClick={() => changeQuantity(item.id, -1)}
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-10 px-3 text-center text-sm font-semibold text-slate-950 dark:text-slate-100">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full"
                            onClick={() => changeQuantity(item.id, 1)}
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Line Total
                          </p>
                          <p className="text-base font-semibold text-slate-950 dark:text-slate-100">
                            ₹{lineTotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-950 dark:bg-slate-800 p-4 text-white">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Grand Total</span>
              <span className="text-2xl font-semibold text-white">
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <Button
              className="w-full"
              onClick={postCharge}
              disabled={!cart.length || !selectedGuestDetails}
            >
              <ReceiptText className="h-4 w-4" />
              Post Charge to Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default KitchenPOS;
