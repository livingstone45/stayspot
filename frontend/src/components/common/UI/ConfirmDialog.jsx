import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  loading = false
}) => {
  const typeConfig = {
    warning: {
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-600',
      confirmVariant: 'warning'
    },
    danger: {
      icon: ExclamationTriangleIcon,
      iconColor: 'text-red-600',
      confirmVariant: 'danger'
    },
    info: {
      icon: null,
      iconColor: 'text-blue-600',
      confirmVariant: 'primary'
    }
  };

  const config = typeConfig[type] || typeConfig.warning;
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              <Icon className="h-6 w-6" />
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;