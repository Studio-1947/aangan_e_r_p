import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Filter,
  Minus,
  Package,
  Plus,
  Search,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

type ItemCategory = "Linen" | "Consumables" | "Electronics" | "Kitchen" | "Toiletries";

type InventoryItem = {
  id: string;
  name: string;
  category: ItemCategory;
  currentStock: number;
  minimumThreshold: number;
  unit: string;
};

const initialInventory: InventoryItem[] = [
  { id: "inv-blankets", name: "Extra Blankets", category: "Linen", currentStock: 14, minimumThreshold: 8, unit: "pcs" },
  { id: "inv-pillowcovers", name: "Pillow Covers", category: "Linen", currentStock: 22, minimumThreshold: 12, unit: "pcs" },
  { id: "inv-bedsheets", name: "Bedsheets (King)", category: "Linen", currentStock: 6, minimumThreshold: 10, unit: "sets" },
  { id: "inv-heaters", name: "Room Heaters", category: "Electronics", currentStock: 4, minimumThreshold: 5, unit: "units" },
  { id: "inv-fans", name: "Ceiling Fans", category: "Electronics", currentStock: 8, minimumThreshold: 6, unit: "units" },
  { id: "inv-tea", name: "Tea / Coffee Sachets", category: "Kitchen", currentStock: 26, minimumThreshold: 12, unit: "boxes" },
  { id: "inv-water", name: "Mineral Water (1L)", category: "Kitchen", currentStock: 5, minimumThreshold: 20, unit: "cases" },
  { id: "inv-toiletries", name: "Toiletries Kit", category: "Toiletries", currentStock: 9, minimumThreshold: 15, unit: "kits" },
  { id: "inv-soap", name: "Bath Soap", category: "Toiletries", currentStock: 18, minimumThreshold: 10, unit: "bars" },
  { id: "inv-toilet-paper", name: "Toilet Paper", category: "Consumables", currentStock: 3, minimumThreshold: 12, unit: "rolls" },
  { id: "inv-garbage-bags", name: "Garbage Bags", category: "Consumables", currentStock: 40, minimumThreshold: 20, unit: "pcs" },
];

const categories: Array<ItemCategory | "All"> = [
  "All", "Linen", "Consumables", "Electronics", "Kitchen", "Toiletries",
];

const categoryColors: Record<ItemCategory, string> = {
  Linen: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Consumables: "bg-slate-50 text-slate-700 border-slate-200",
  Electronics: "bg-blue-50 text-blue-700 border-blue-200",
  Kitchen: "bg-amber-50 text-amber-700 border-amber-200",
  Toiletries: "bg-rose-50 text-rose-700 border-rose-200",
};

function AddItemDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Register a new item in your property stock.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input id="item-name" placeholder="e.g. Lavender Soap" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-category">Category</Label>
            <Input id="item-category" placeholder="e.g. Toiletries" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-unit">Unit</Label>
            <Input id="item-unit" placeholder="e.g. bars" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-stock">Initial Stock</Label>
            <Input id="item-stock" type="number" placeholder="20" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-threshold">Min Threshold</Label>
            <Input id="item-threshold" type="number" placeholder="5" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function InventoryList() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | "All">("All");
  const [addItemOpen, setAddItemOpen] = useState(false);

  const lowStockItems = useMemo(
    () => items.filter((it) => it.currentStock < it.minimumThreshold),
    [items],
  );

  const filtered = useMemo(
    () =>
      items.filter((it) => {
        const matchesSearch = it.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "All" || it.category === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [items, search, categoryFilter],
  );

  function adjustStock(id: string, delta: number) {
    setItems((current) =>
      current.map((it) =>
        it.id === id
          ? { ...it, currentStock: Math.max(0, it.currentStock + delta) }
          : it,
      ),
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Inventory
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Stock Management
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {items.length} items · {lowStockItems.length} low stock
          </p>
        </div>
        <Button onClick={() => setAddItemOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Low stock warning */}
      <AnimatePresence>
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-4 py-3"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-300">
                {lowStockItems.length} item{lowStockItems.length !== 1 ? "s" : ""} running low
              </p>
              <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                {lowStockItems.map((it) => it.name).join(", ")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                categoryFilter === cat
                  ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <CardTitle>All Items</CardTitle>
          <CardDescription>
            Showing {filtered.length} of {items.length} items
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Min. Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Adjust</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filtered.map((it, i) => {
                  const isLow = it.currentStock < it.minimumThreshold;
                  return (
                    <motion.tr
                      key={it.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <TableCell className="font-medium text-slate-950 dark:text-slate-50">
                        {it.name}
                        <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500">/ {it.unit}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryColors[it.category]}`}
                        >
                          {it.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-950 dark:text-slate-50">
                        {it.currentStock}
                      </TableCell>
                      <TableCell className="text-center text-slate-500 dark:text-slate-400">
                        {it.minimumThreshold}
                      </TableCell>
                      <TableCell>
                        <Badge variant={isLow ? "warning" : "success"}>
                          {isLow ? "Low Stock" : "In Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-full"
                            onClick={() => adjustStock(it.id, -1)}
                            disabled={it.currentStock === 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="min-w-8 text-center text-xs font-semibold text-slate-950 dark:text-slate-50">
                            {it.currentStock}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-full"
                            onClick={() => adjustStock(it.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="grid min-h-48 place-items-center text-center">
              <div>
                <Package className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                <p className="mt-3 font-medium text-slate-600 dark:text-slate-400">No items found</p>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                  Try a different search or filter.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AddItemDialog
        open={addItemOpen}
        onClose={() => setAddItemOpen(false)}
      />
    </div>
  );
}

export default InventoryList;
