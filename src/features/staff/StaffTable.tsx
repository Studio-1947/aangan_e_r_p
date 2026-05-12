import { demoStaff } from "../../data/mockData";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import { useAuth } from "../../context/AuthContext";

export function StaffTable() {
  const { user } = useAuth();

  if (user?.role === "Staff") {
    return (
      <div className="p-6 bg-white border rounded">
        Access Denied — staff cannot view this area.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Staff Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoStaff.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.role}</TableCell>
              <TableCell>{s.contact}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default StaffTable;
