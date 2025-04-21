interface FilterBarProps {
  filters: string[]
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
}

export function FilterBar({ filters, selectedFilters, onFilterChange }: FilterBarProps) {
  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      onFilterChange(selectedFilters.filter(f => f !== filter))
    } else {
      onFilterChange([...selectedFilters, filter])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => toggleFilter(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedFilters.includes(filter)
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
} 