import React from 'react';
import Select from '../UI/Select';

const FormSelect = ({
  name,
  label,
  options = [],
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  searchable = false,
  multiple = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...props
}) => {
  const handleChange = (selectedValue) => {
    onChange({
      target: {
        name,
        value: selectedValue
      }
    });
  };

  const selectProps = {
    id: name,
    name,
    label,
    options,
    value: value || (multiple ? [] : ''),
    onChange: handleChange,
    error,
    helperText,
    required,
    disabled,
    placeholder,
    searchable,
    multiple,
    className,
    containerClassName,
    labelClassName,
    ...props
  };

  return <Select {...selectProps} />;
};

export default FormSelect;