"use client";

import { useEffect } from "react";
import { useData } from "@/context/data-context";
import { EmployeeCard } from "@/components/employee-card";
import { EmployeeFormModal } from "@/components/employee-form-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function EmployeesPage() {
  const {
    employees,
    reload,
    deleteEmployee,
  } = useData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<typeof employees[0] | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<typeof employees[0] | null>(null);

  // Load employees from backend on mount
  useEffect(() => {
    reload();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: typeof employees[0]) => {
      const matchesSearch =
        (emp.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (emp.email?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchesStatus =
        statusFilter === "all" || emp.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  const handleEdit = (emp: typeof employees[0]) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const handleDelete = (emp: typeof employees[0]) => {
    setDeletingEmployee(emp);
  };

  const confirmDelete = async () => {
    if (deletingEmployee && deletingEmployee._id) {
      await deleteEmployee(deletingEmployee._id);
      toast.success("Employee deleted");
      setDeletingEmployee(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employees</h1>
        <p className="text-muted-foreground">Manage employees</p>
      </div>

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
        filterPlaceholder="Filter by status"
        onAddClick={() => {
          setEditingEmployee(null);
          setIsModalOpen(true);
        }}
        addButtonLabel="Add Employee"
      />

      {filteredEmployees.length === 0 ? (
        <div className="glass-card p-10 rounded-2xl text-center">
          <p className="text-muted-foreground">No employees found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => {
            const assignedTasks = emp._id ? (typeof useData === "function" ? useData().tasks.filter(
              (t) => {
                if (typeof t.assignee === "object" && t.assignee !== null && typeof (t.assignee as any)._id === "string") {
                  return (t.assignee as any)._id === emp._id;
                }
                return t.assignee === emp._id;
              }
            ) : []) : [];
            return (
              <div key={emp._id}>
                <EmployeeCard
                  employee={emp}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                {assignedTasks.length > 0 && (
                  <div className="mt-2 p-2 bg-secondary/30 rounded-xl">
                    <div className="font-semibold text-sm mb-1">Assigned Tasks:</div>
                    <ul className="space-y-1">
                      {assignedTasks.map((task) => (
                        <li key={task._id} className="text-xs">
                          {task.title} <span className="italic">({task.status})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setEditingEmployee(null);
          setIsModalOpen(false);
        }}
        employee={editingEmployee}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={confirmDelete}
        title="Delete Employee"
        description={`Delete ${deletingEmployee?.name ?? "this employee"}?`}
      />
    </div>
  );
}
