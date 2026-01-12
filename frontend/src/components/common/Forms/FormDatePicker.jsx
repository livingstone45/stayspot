import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import Input from '../UI/Input';

const FormDatePicker = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...props
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (e) => {
    onChange({
      target: {
        name,
        value: e.target.value
      }
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const inputProps = {
    id: name,
    name,
    label,
    type: 'date',
    value: formatDate(value),
    onChange: handleChange,
    error,
    helperText,
    required,
    disabled,
    className: `pr-10 ${className}`,
    containerClassName,
    labelClassName,
    ...props
  };

  return (
    <div className="relative">
      <Input {...inputProps} />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <CalendarIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default FormDatePicker;