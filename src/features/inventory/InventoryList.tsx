import { useState } from "react";
import { demoInventory } from "../../data/mockData";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export function InventoryList() {
  const [items, setItems] = useState(demoInventory);

  function restock(id: string) {
    setItems((current) =>
      current.map((it) =>
        it.id === id ? { ...it, currentStock: it.currentStock + 5 } : it,
      ),
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Inventory</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((it) => (
            <TableRow key={it.id}>
              <TableCell>{it.name}</TableCell>
              <TableCell>General</TableCell>
              <TableCell>{it.currentStock}</TableCell>
              <TableCell>
                {it.currentStock > it.minimumThreshold ? (
                  <Badge variant="success">In Stock</Badge>
                ) : (
                  <Badge variant="warning">Low Stock</Badge>
                )}
              </TableCell>
              <TableCell>
                <Button onClick={() => restock(it.id)}>Restock</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default InventoryList;
