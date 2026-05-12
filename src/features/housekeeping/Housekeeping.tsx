import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Plus,
  Wrench,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { demoRooms, demoStaff } from "../../data/mockData";

type TaskStatus = "Pending" | "Cleaning" | "Ready" | "Maintenance";

type HousekeepingTask = {
  id: string;
  roomNumber: string;
  roomType: string;
  status: TaskStatus;
  assignedTo: string | null;
  checklist: { label: string; done: boolean }[];
  priority: "Normal" | "Urgent";
};

const initialTasks: HousekeepingTask[] = demoRooms.map((room, i) => ({
  id: `task-${room.id}`,
  roomNumber: room.number,
  roomType: room.type,
  status:
    room.status === "Maintenance"
      ? "Maintenance"
      : room.status === "Occupied"
        ? "Pending"
        : i % 3 === 0
          ? "Cleaning"
          : "Ready",
  assignedTo: i % 2 === 0 ? demoStaff[0].name : null,
  priority: i === 0 ? "Urgent" : "Normal",
  checklist: [
    { label: "Change bed linen", done: false },
    { label: "Clean bathroom", done: false },
    { label: "Replenish toiletries", done: false },
    { label: "Vacuum / sweep floor", done: false },
    { label: "Check minibar / amenities", done: false },
  ],
}));

const statusColumns: TaskStatus[] = ["Pending", "Cleaning", "Ready", "Maintenance"];

const statusConfig: Record<
  TaskStatus,
  { bg: string; badge: string; icon: typeof ClipboardList }
> = {
  Pending: { bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800", badge: "warning", icon: ClipboardList },
  Cleaning: { bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800", badge: "outline", icon: ClipboardList },
  Ready: { bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800", badge: "success", icon: CheckCircle2 },
  Maintenance: { bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800", badge: "destructive", icon: Wrench },
};

const nextStatus: Record<TaskStatus, TaskStatus | null> = {
  Pending: "Cleaning",
  Cleaning: "Ready",
  Ready: null,
  Maintenance: "Ready",
};

const nextActionLabel: Record<TaskStatus, string | null> = {
  Pending: "Start Cleaning",
  Cleaning: "Mark Ready",
  Ready: null,
  Maintenance: "Mark Resolved",
};

export function Housekeeping() {
  const [tasks, setTasks] = useState<HousekeepingTask[]>(initialTasks);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function advanceStatus(taskId: string) {
    setTasks((current) =>
      current.map((t) => {
        if (t.id !== taskId) return t;
        const next = nextStatus[t.status];
        if (!next) return t;
        return { ...t, status: next };
      }),
    );
  }

  function toggleChecklistItem(taskId: string, idx: number) {
    setTasks((current) =>
      current.map((t) => {
        if (t.id !== taskId) return t;
        const checklist = t.checklist.map((item, i) =>
          i === idx ? { ...item, done: !item.done } : item,
        );
        return { ...t, checklist };
      }),
    );
  }

  function assignStaff(taskId: string) {
    const housekeepingStaff = demoStaff.find((s) => s.role === "Housekeeping");
    setTasks((current) =>
      current.map((t) =>
        t.id === taskId ? { ...t, assignedTo: housekeepingStaff?.name ?? "Anita Bose" } : t,
      ),
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Housekeeping
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Room Status Board
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Track cleaning progress and assign staff to each room.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {statusColumns.map((status) => {
          const count = tasks.filter((t) => t.status === status).length;
          const config = statusConfig[status];
          return (
            <div
              key={status}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${config.bg}`}
            >
              <span>{status}</span>
              <span className="rounded-full bg-white/70 dark:bg-black/20 px-1.5 py-0.5 text-xs font-bold">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Kanban columns */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statusColumns.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          const config = statusConfig[status];

          return (
            <div key={status} className="space-y-3">
              {/* Column header */}
              <div className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 ${config.bg}`}>
                <div className="flex items-center gap-2">
                  <config.icon className="h-4 w-4" />
                  <span className="text-sm font-semibold">{status}</span>
                </div>
                <span className="rounded-full bg-white/60 dark:bg-black/20 px-2 py-0.5 text-xs font-bold">
                  {columnTasks.length}
                </span>
              </div>

              {/* Task cards */}
              <div className="space-y-2.5">
                {columnTasks.map((task, i) => {
                  const isExpanded = expandedId === task.id;
                  const doneCount = task.checklist.filter((c) => c.done).length;
                  const actionLabel = nextActionLabel[task.status];

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      layout
                    >
                      <Card className="overflow-hidden border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardHeader className="pb-2 pt-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-sm">
                                Room {task.roomNumber}
                              </CardTitle>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                {task.roomType}
                              </p>
                            </div>
                            {task.priority === "Urgent" && (
                              <Badge variant="destructive" className="text-[10px]">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3 pb-3 pt-0">
                          {/* Progress */}
                          <div>
                            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                              <span>Checklist</span>
                              <span>{doneCount}/{task.checklist.length}</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                style={{
                                  width: `${(doneCount / task.checklist.length) * 100}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Assigned to */}
                          {task.assignedTo ? (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Assigned to:{" "}
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {task.assignedTo}
                              </span>
                            </p>
                          ) : (
                            <button
                              className="text-xs text-blue-600 hover:underline"
                              onClick={() => assignStaff(task.id)}
                            >
                              + Assign staff
                            </button>
                          )}

                          {/* Expand checklist */}
                          <button
                            className="flex w-full items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : task.id)
                            }
                          >
                            <span>View checklist</span>
                            <ChevronRight
                              className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                            />
                          </button>

                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-1.5 overflow-hidden"
                            >
                              {task.checklist.map((item, idx) => (
                                <label
                                  key={item.label}
                                  className="flex cursor-pointer items-center gap-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.done}
                                    onChange={() =>
                                      toggleChecklistItem(task.id, idx)
                                    }
                                    className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600"
                                  />
                                  <span
                                    className={`text-xs ${item.done ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-600 dark:text-slate-400"}`}
                                  >
                                    {item.label}
                                  </span>
                                </label>
                              ))}
                            </motion.div>
                          )}

                          {/* Advance status button */}
                          {actionLabel && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full gap-1.5 text-xs"
                              onClick={() => advanceStatus(task.id)}
                            >
                              {actionLabel}
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="grid min-h-24 place-items-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Housekeeping;
