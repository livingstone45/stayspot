import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import * as Yup from 'yup';

export const useForm = ({
  initialValues = {},
  validationSchema = null,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
  enableReinitialize = false,
  resetOnSubmit = false
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});

  const initialValuesRef = useRef(initialValues);
  const validationSchemaRef = useRef(validationSchema);

  // Update refs when props change
  useEffect(() => {
    initialValuesRef.current = initialValues;
    validationSchemaRef.current = validationSchema;
  }, [initialValues, validationSchema]);

  // Reinitialize form when initialValues change
  useEffect(() => {
    if (enableReinitialize) {
      setValues(initialValues);
      setErrors({});
      setTouched({});
      setFieldErrors({});
    }
  }, [initialValues, enableReinitialize]);

  const validateField = useCallback(async (fieldName, value) => {
    if (!validationSchemaRef.current) return null;

    try {
      await validationSchemaRef.current.validateAt(fieldName, { [fieldName]: value });
      return null;
    } catch (error) {
      return error.message;
    }
  }, []);

  const validateForm = useCallback(async (formValues = values) => {
    if (!validationSchemaRef.current) return {};

    try {
      await validationSchemaRef.current.validate(formValues, { abortEarly: false });
      return {};
    } catch (error) {
      const validationErrors = {};
      
      if (error.inner) {
        error.inner.forEach(err => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
      }
      
      return validationErrors;
    }
  }, [values]);

  const setFieldValue = useCallback(async (fieldName, value, shouldValidate = validateOnChange) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));

    if (shouldValidate) {
      setIsValidating(true);
      const fieldError = await validateField(fieldName, value);
      
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
      
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
      
      setIsValidating(false);
    }
  }, [validateField, validateOnChange]);

  const setFieldTouched = useCallback(async (fieldName, isTouched = true, shouldValidate = validateOnBlur) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));

    if (shouldValidate && isTouched) {
      setIsValidating(true);
      const fieldError = await validateField(fieldName, values[fieldName]);
      
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
      
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
      
      setIsValidating(false);
    }
  }, [validateField, validateOnBlur, values]);

  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value, type, checked, files } = event.target;
    
    let fieldValue = value;
    
    if (type === 'checkbox') {
      fieldValue = checked;
    } else if (type === 'file') {
      fieldValue = files;
    } else if (type === 'number') {
      fieldValue = value === '' ? '' : Number(value);
    }

    setFieldValue(name, fieldValue);
  }, [setFieldValue]);

  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setFieldTouched(name, true);
  }, [setFieldTouched]);

  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    setSubmitCount(prev => prev + 1);
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    try {
      // Validate entire form
      const validationErrors = await validateForm(values);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setFieldErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      // Clear errors if validation passes
      setErrors({});
      setFieldErrors({});

      // Call onSubmit handler
      if (onSubmit) {
        await onSubmit(values, {
          setFieldError,
          setFieldValue,
          setErrors,
          setSubmitting: setIsSubmitting,
          resetForm
        });
      }

      // Reset form if configured to do so
      if (resetOnSubmit) {
        resetForm();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Handle server validation errors
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        setErrors(serverErrors);
        setFieldErrors(serverErrors);
      } else {
        setErrors({ submit: error.message || 'An error occurred during submission' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, resetOnSubmit, setFieldError, setFieldValue]);

  const resetForm = useCallback((newValues = initialValuesRef.current) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setFieldErrors({});
    setIsSubmitting(false);
    setIsValidating(false);
    setSubmitCount(0);
  }, []);

  const setFormValues = useCallback((newValues, shouldValidate = false) => {
    setValues(newValues);
    
    if (shouldValidate) {
      validateForm(newValues).then(validationErrors => {
        setErrors(validationErrors);
        setFieldErrors(validationErrors);
      });
    }
  }, [validateForm]);

  const setFormErrors = useCallback((newErrors) => {
    setErrors(newErrors);
    setFieldErrors(newErrors);
  }, []);

  const getFieldProps = useCallback((fieldName) => {
    return {
      name: fieldName,
      value: values[fieldName] || '',
      onChange: handleChange,
      onBlur: handleBlur
    };
  }, [values, handleChange, handleBlur]);

  const getFieldMeta = useCallback((fieldName) => {
    return {
      value: values[fieldName],
      error: errors[fieldName],
      touched: touched[fieldName],
      initialValue: initialValuesRef.current[fieldName],
      initialTouched: false,
      initialError: undefined
    };
  }, [values, errors, touched]);

  const getFieldHelpers = useCallback((fieldName) => {
    return {
      setValue: (value, shouldValidate) => setFieldValue(fieldName, value, shouldValidate),
      setTouched: (isTouched, shouldValidate) => setFieldTouched(fieldName, isTouched, shouldValidate),
      setError: (error) => setFieldError(fieldName, error)
    };
  }, [setFieldValue, setFieldTouched, setFieldError]);

  // Array field helpers
  const arrayHelpers = useCallback((fieldName) => {
    const fieldValue = values[fieldName] || [];
    
    return {
      push: (value) => {
        setFieldValue(fieldName, [...fieldValue, value]);
      },
      pop: () => {
        const newArray = [...fieldValue];
        newArray.pop();
        setFieldValue(fieldName, newArray);
      },
      insert: (index, value) => {
        const newArray = [...fieldValue];
        newArray.splice(index, 0, value);
        setFieldValue(fieldName, newArray);
      },
      remove: (index) => {
        const newArray = [...fieldValue];
        newArray.splice(index, 1);
        setFieldValue(fieldName, newArray);
      },
      replace: (index, value) => {
        const newArray = [...fieldValue];
        newArray[index] = value;
        setFieldValue(fieldName, newArray);
      },
      swap: (indexA, indexB) => {
        const newArray = [...fieldValue];
        [newArray[indexA], newArray[indexB]] = [newArray[indexB], newArray[indexA]];
        setFieldValue(fieldName, newArray);
      },
      move: (from, to) => {
        const newArray = [...fieldValue];
        const item = newArray.splice(from, 1)[0];
        newArray.splice(to, 0, item);
        setFieldValue(fieldName, newArray);
      }
    };
  }, [values, setFieldValue]);

  // Computed values
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && Object.keys(fieldErrors).length === 0;
  }, [errors, fieldErrors]);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  }, [values]);

  const touchedFields = useMemo(() => {
    return Object.keys(touched).filter(key => touched[key]);
  }, [touched]);

  const errorFields = useMemo(() => {
    return Object.keys(errors).filter(key => errors[key]);
  }, [errors]);

  // Validation helpers
  const validateAllFields = useCallback(async () => {
    setIsValidating(true);
    const validationErrors = await validateForm(values);
    setErrors(validationErrors);
    setFieldErrors(validationErrors);
    setIsValidating(false);
    return Object.keys(validationErrors).length === 0;
  }, [validateForm, values]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setFieldErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    // Form state
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isValid,
    isDirty,
    submitCount,
    touchedFields,
    errorFields,

    // Form handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Field methods
    setFieldValue,
    setFieldTouched,
    setFieldError,
    getFieldProps,
    getFieldMeta,
    getFieldHelpers,

    // Form methods
    setFormValues,
    setFormErrors,
    resetForm,
    validateForm,
    validateField,
    validateAllFields,
    clearErrors,
    clearFieldError,

    // Array helpers
    arrayHelpers,

    // Validation
    validationSchema: validationSchemaRef.current
  };
};

// Predefined validation schemas
export const validationSchemas = {
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phone: Yup.string().matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
  required: (message = 'This field is required') => Yup.string().required(message),
  number: Yup.number().typeError('Must be a number'),
  positiveNumber: Yup.number().positive('Must be a positive number').typeError('Must be a number'),
  url: Yup.string().url('Invalid URL format'),
  date: Yup.date().typeError('Invalid date format'),
  futureDate: Yup.date().min(new Date(), 'Date must be in the future').typeError('Invalid date format')
};

export default useForm;