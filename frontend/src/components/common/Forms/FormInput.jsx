import React from 'react';
import Input from '../UI/Input';

const FormInput = ({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  validation = {},
  ...props
}) => {
  const handleChange = (e) => {
    let value = e.target.value;

    // Apply validation patterns
    if (validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value) && value !== '') {
        return;
      }
    }

    if (type === 'number') {
      value = parseFloat(value) || '';
    }

    onChange({
      target: {
        name,
        value
      }
    });
  };

  const inputProps = {
    id: name,
    name,
    label,
    type,
    placeholder,
    value: value || '',
    onChange: handleChange,
    error,
    helperText,
    required,
    disabled,
    className,
    containerClassName,
    labelClassName,
    ...props
  };

  return <Input {...inputProps} />;
};

export default FormInput;