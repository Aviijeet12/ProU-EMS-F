"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Filter } from "lucide-react"

interface SearchFilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filterValue?: string
  onFilterChange?: (value: string) => void
  filterOptions?: { value: string; label: string }[]
  filterPlaceholder?: string
  onAddClick: () => void
  addButtonLabel: string
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  filterPlaceholder,
  onAddClick,
  addButtonLabel,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-secondary/50 border-border/50"
        />
      </div>
      {filterOptions && onFilterChange && (
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-secondary/50 border-border/50">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder={filterPlaceholder} />
          </SelectTrigger>
          <SelectContent className="glass border-border/50">
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Button onClick={onAddClick} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
        <Plus className="h-4 w-4" />
        {addButtonLabel}
      </Button>
    </div>
  )
}
