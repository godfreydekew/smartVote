
import React from 'react';

// Utility to track edited fields in a form
export const useEditTracker = () => {
  const [editedFields, setEditedFields] = React.useState<Set<string>>(new Set());
  
  const markAsEdited = (fieldName: string) => {
    setEditedFields(prev => {
      const newSet = new Set(prev);
      newSet.add(fieldName);
      return newSet;
    });
  };
  
  const isEdited = (fieldName: string) => {
    return editedFields.has(fieldName);
  };
  
  const resetEdits = () => {
    setEditedFields(new Set());
  };
  
  return { markAsEdited, isEdited, resetEdits, editedFields };
};

// Enhance form fields with edit tracking
export const getEditedFieldClass = (isEdited: boolean) => {
  return isEdited ? 'border-l-4 border-blue-500 pl-3 -ml-3 transition-all duration-200' : '';
};
