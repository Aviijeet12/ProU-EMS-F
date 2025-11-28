"use client";

import { useData } from "@/context/data-context";
import { TaskCard } from "@/components/task-card";
import { useAuth } from "@/context/auth-context";

export default function UserDashboardPage() {
  const { tasks } = useData();
  const { user } = useAuth();

  console.log('DEBUG dashboard MOUNTED');
  console.log('DEBUG dashboard tasks:', tasks);
  // myTasks, fallbackTasks are declared below
  console.log('DEBUG dashboard user:', user);

  // Show tasks assigned to this employee OR owned by this user
  const myEmployeeId = user?.employeeId;
  const myUserId = user?.id;
  console.log('DEBUG user dashboard:', { myEmployeeId, myUserId, tasks });
  const myTasks = tasks.filter((task) => {
    let assigneeEmail: string | undefined;
    let assigneeId: string | undefined;
    if (typeof task.assignee === "object" && task.assignee !== null) {
      assigneeEmail = (task.assignee as { email?: string }).email;
      assigneeId = String((task.assignee as { _id?: any })._id);
    } else if (typeof task.assignee === "string") {
      assigneeId = task.assignee;
    }
    let ownerId: string | undefined;
    if (typeof task.owner === "object" && task.owner !== null && "_id" in task.owner) {
      ownerId = String((task.owner as { _id: any })._id);
    } else if (typeof task.owner === "string") {
      ownerId = task.owner;
    }
    return (
      assigneeEmail === user?.email ||
      assigneeId === String(user?.employeeId) ||
      ownerId === String(user?.id)
    );
  });
  console.log('DEBUG filtered myTasks:', myTasks);

  // Fallback demo tasks if none found
  const fallbackTasks = [
    {
      _id: "demo1",
      title: "Demo Task 1",
      description: "This is a demo task for testing.",
      status: "todo" as "todo",
      assignee: {
        _id: "demo",
        name: user?.name ?? "Demo User",
        email: user?.email,
        phone: undefined,
        position: undefined,
        owner: user?.id ?? "demo-owner",
        department: undefined,
        status: undefined,
      },
      owner: user?.id ?? "demo-owner",
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      _id: "demo2",
      title: "Demo Task 2",
      description: "Another demo task for your dashboard.",
      status: "in-progress" as "in-progress",
      assignee: {
        _id: "demo",
        name: user?.name ?? "Demo User",
        email: user?.email,
        phone: undefined,
        position: undefined,
        owner: user?.id ?? "demo-owner",
        department: undefined,
        status: undefined,
      },
      owner: user?.id ?? "demo-owner",
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  const renderTasks = myTasks.length > 0 ? myTasks : fallbackTasks;
  console.log('DEBUG dashboard renderTasks:', renderTasks);
  return (
    <div className="space-y-6">
      <div style={{color:'red',fontWeight:'bold'}}>DEBUG DASHBOARD MOUNTED</div>
      <div>
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-muted-foreground">Tasks assigned to you</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {renderTasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={() => {}} onDelete={() => {}} />
        ))}
      </div>
    </div>
  );
}
