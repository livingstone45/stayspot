import toast from 'react-hot-toast';

/**
 * Notification utilities for user feedback
 */

class NotificationService {
  constructor() {
    this.defaultOptions = {
      duration: 4000,
      position: 'top-right'
    };
  }

  success(message, options = {}) {
    return toast.success(message, {
      ...this.defaultOptions,
      ...options
    });
  }

  error(message, options = {}) {
    return toast.error(message, {
      ...this.defaultOptions,
      duration: 6000,
      ...options
    });
  }

  info(message, options = {}) {
    return toast(message, {
      ...this.defaultOptions,
      icon: 'ℹ️',
      ...options
    });
  }

  warning(message, options = {}) {
    return toast(message, {
      ...this.defaultOptions,
      icon: '⚠️',
      ...options
    });
  }

  loading(message, options = {}) {
    return toast.loading(message, {
      ...this.defaultOptions,
      ...options
    });
  }

  promise(promise, messages, options = {}) {
    return toast.promise(promise, messages, {
      ...this.defaultOptions,
      ...options
    });
  }

  dismiss(toastId) {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }

  // Property management specific notifications
  propertyCreated(propertyName) {
    this.success(`Property "${propertyName}" created successfully`);
  }

  propertyUpdated(propertyName) {
    this.success(`Property "${propertyName}" updated successfully`);
  }

  propertyDeleted(propertyName) {
    this.success(`Property "${propertyName}" deleted successfully`);
  }

  tenantInvited(email) {
    this.success(`Invitation sent to ${email}`);
  }

  paymentProcessed(amount) {
    this.success(`Payment of $${amount} processed successfully`);
  }

  maintenanceRequested() {
    this.success('Maintenance request submitted successfully');
  }

  maintenanceCompleted() {
    this.success('Maintenance request completed');
  }

  leaseCreated() {
    this.success('Lease agreement created successfully');
  }

  // Error notifications
  networkError() {
    this.error('Network error. Please check your connection.');
  }

  serverError() {
    this.error('Server error. Please try again later.');
  }

  validationError(message) {
    this.error(message || 'Please check your input and try again.');
  }

  permissionDenied() {
    this.error('You do not have permission to perform this action.');
  }

  sessionExpired() {
    this.error('Your session has expired. Please log in again.');
  }
}

export default new NotificationService();