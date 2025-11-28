"use client";

import { useState, useMemo, useEffect } from "react";
import { useData, type Employee } from "@/context/data-context";
import { EmployeeCard } from "@/components/employee-card";
import { EmployeeFormModal } from "@/components/employee-form-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { toast } from "sonner";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function AdminEmployeesPage() {
  const {
    employees,
    reload,       // FIXED
    deleteEmployee,
  } = useData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Load on mount
  useEffect(() => {
    reload();      // FIXED
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.email?.toLowerCase().includes(search.toLowerCase()) ||
        (employee.department || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setDeletingEmployee(employee);
  };

  const confirmDelete = async () => {
    if (deletingEmployee) {
      const ok = await deleteEmployee(deletingEmployee._id);
      if (ok) {
        toast.success("Employee deleted successfully");
      } else {
        toast.error("Failed to delete employee");
      }
      setDeletingEmployee(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Employees</h1>
        <p className="text-muted-foreground">
          Manage your team members and their information
        </p>
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
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No employees found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        employee={editingEmployee}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={confirmDelete}
        title="Delete Employee"
        description={`Are you sure you want to delete ${deletingEmployee?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
