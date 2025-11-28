"use client";

import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";
import { StatsCard } from "@/components/stats-card";
import { CheckSquare, Clock, TrendingUp, Calendar, ArrowRight, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const { tasks, employees, updateTask } = useData();

  // REAL FIX: employee belongs to the logged-in user via "owner"
  const employee = employees.find((e) => e.owner === user?.id) || null;
  const employeeId = employee?._id;

  // No employee found = force user to fill profile
  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground text-lg">
          No employee profile found. Please update your profile.
        </p>
      </div>
    );
  }

  // Robust filter: match by assignee ID or assignee.email
  const myTasks = tasks.filter((t) => {
    if (typeof t.assignee === "object" && t.assignee !== null) {
      if (t.assignee._id && t.assignee._id === employeeId) return true;
      if (t.assignee.email && user?.email && t.assignee.email === user.email) return true;
    } else if (typeof t.assignee === "string") {
      if (t.assignee === employeeId) return true;
    }
    return false;
  });
  console.log('DEBUG employee dashboard tasks:', tasks);
  console.log('DEBUG employee dashboard myTasks:', myTasks);
  console.log('DEBUG employee dashboard employee:', employee);
  console.log('DEBUG employee dashboard user:', user);

  const pendingTasks = myTasks.filter((t) => t.status === "todo");
  const inProgressTasks = myTasks.filter((t) => t.status === "in-progress");
  const completedTasks = myTasks.filter((t) => t.status === "done");

  const upcomingTasks = [...myTasks]
    .filter((t) => t.status !== "done")
    .sort((a, b) => new Date(a.dueDate ?? "1970-01-01").getTime() - new Date(b.dueDate ?? "1970-01-01").getTime())
    .slice(0, 5);

  const handleStartTask = async (taskId: string) => {
    await updateTask(taskId, { status: "in-progress" });
    toast.success("Task started!");
  };

  const handleCompleteTask = async (taskId: string) => {
    await updateTask(taskId, { status: "done" });
    toast.success("Task completed!");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "low":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      case "in-progress":
        return "text-accent bg-accent/10";
      case "completed":
        return "text-primary bg-primary/10";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">
              Hello,{" "}
              <span className="text-accent text-glow-accent">
                {employee.name}
              </span>
            </h1>
            <Sparkles className="w-7 h-7 text-accent animate-pulse" />
          </div>

          <p className="text-muted-foreground text-lg">
            {employee.position || "Team Member"} •{" "}
            {employee.department || "Department"}
          </p>

          <div className="absolute -bottom-4 left-0 w-24 h-1 bg-gradient-to-r from-accent to-primary rounded-full" />
        </div>

        <Link href="/employee/tasks">
          <Button className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 rounded-xl group h-12 px-6 font-bold shimmer">
            View All Tasks
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
        <StatsCard
          title="Total Tasks"
          value={myTasks.length}
          change="Assigned to you"
          icon={CheckSquare}
          iconColor="text-accent"
        />
        <StatsCard
          title="Pending"
          value={pendingTasks.length}
          change="Not started"
          icon={Clock}
          iconColor="text-yellow-400"
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks.length}
          change="Currently working"
          icon={Target}
          iconColor="text-accent"
        />
        <StatsCard
          title="Completed"
          value={completedTasks.length}
          change={`${
            myTasks.length > 0
              ? Math.round((completedTasks.length / myTasks.length) * 100)
              : 0
          }% done`}
          icon={TrendingUp}
          iconColor="text-primary"
        />
      </div>

      {/* Upcoming + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full" />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Upcoming Tasks</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground font-medium">
                All caught up! No pending tasks.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-border/30 hover:border-accent/30 transition-all duration-300 group card-lift"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate group-hover:text-accent transition-colors">
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-lg border font-medium",
                          getPriorityColor(task.priority ?? "low")
                        )}
                      >
                        {task.priority}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        Due:{" "}
                        {new Date(task.dueDate ?? "1970-01-01").toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-lg font-semibold",
                      getStatusColor(task.status)
                    )}
                  >
                    {task.status.replace("-", " ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />

          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>

          <div className="space-y-4">
            {/* Start Pending */}
            {pendingTasks.length > 0 && (
              <div className="p-5 rounded-xl bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border border-yellow-400/20 card-lift">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm text-yellow-400 font-bold mb-1 uppercase tracking-wide">
                      Next Pending
                    </p>
                    <h3 className="font-semibold truncate">
                      {pendingTasks[0].title}
                    </h3>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleStartTask(pendingTasks[0]._id)}
                    className="bg-yellow-400 text-yellow-950 hover:bg-yellow-300 rounded-xl font-bold h-10 px-5"
                  >
                    Start
                  </Button>
                </div>
              </div>
            )}

            {/* Complete In Progress */}
            {inProgressTasks.length > 0 && (
              <div className="p-5 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 card-lift">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm text-accent font-bold mb-1 uppercase tracking-wide">
                      In Progress
                    </p>
                    <h3 className="font-semibold truncate">
                      {inProgressTasks[0].title}
                    </h3>
                  </div>

                  <Button
                    size="sm"
                    onClick={() =>
                      handleCompleteTask(inProgressTasks[0]._id)
                    }
                    className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 rounded-xl font-bold h-10 px-5"
                  >
                    Complete
                  </Button>
                </div>
              </div>
            )}

            {/* Profile link */}
            <Link href="/employee/profile">
              <div className="p-5 rounded-xl bg-secondary/20 border border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer card-lift group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 font-medium">
                      Your Profile
                    </p>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      View & Edit Profile
                    </h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />

        <h2 className="text-xl font-bold mb-6">Your Progress</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-muted-foreground font-medium">Task Completion</span>
              <span className="font-bold text-lg text-primary">
                {myTasks.length > 0
                  ? Math.round((completedTasks.length / myTasks.length) * 100)
                  : 0}
                %
              </span>
            </div>

            <div className="h-4 bg-secondary/30 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700 relative"
                style={{
                  width: `${myTasks.length > 0 ? (completedTasks.length / myTasks.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
