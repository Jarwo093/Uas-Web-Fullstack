import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export const SearchInput = ({ value, onChange, placeholder = 'Search...', debounceMs = 300 }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const timerRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="search-input-wrapper">
      <Search className="search-icon" />
      <input
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        aria-label={placeholder}
      />
      {localValue && (
        <button className="search-clear-btn" onClick={handleClear} aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
};
