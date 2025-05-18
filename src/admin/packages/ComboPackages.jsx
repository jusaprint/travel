import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import ComboPackageCard from './ComboPackageCard';
import { getComboPackages, createComboPackage, updateComboPackage, deleteComboPackage, updateComboPackageOrder } from '../services/dataService';

export default function ComboPackages() {
  const { t } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await getComboPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load packages'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(packages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order field for each item
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setPackages(updatedItems);

    // Update order in database
    try {
      await updateComboPackageOrder(updatedItems);
    } catch (error) {
      console.error('Error updating package order:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update package order'
      });
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
  };

  const handleSave = async (updatedPackage) => {
    try {
      await updateComboPackage(updatedPackage.id, updatedPackage);
      setMessage({
        type: 'success',
        text: 'Package updated successfully'
      });
      setEditingId(null);
      loadPackages();
    } catch (error) {
      console.error('Error updating package:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update package'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      await deleteComboPackage(id);
      setMessage({
        type: 'success',
        text: 'Package deleted successfully'
      });
      loadPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete package'
      });
    }
  };

  const handleDuplicate = async (pkg) => {
    try {
      // Create a copy of the package without the id and timestamps
      const { id, created_at, updated_at, ...packageData } = pkg;
      
      // Add "(Copy)" to the name
      packageData.name = `${packageData.name} (Copy)`;
      
      // Create new package
      const data = await createComboPackage(packageData);
      setMessage({
        type: 'success',
        text: 'Package duplicated successfully'
      });
      loadPackages();
      setEditingId(data.id);
    } catch (error) {
      console.error('Error duplicating package:', error);
      setMessage({
        type: 'error',
        text: 'Failed to duplicate package'
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleAddNew = async () => {
    try {
      const newPackage = {
        name: 'New Combo Package',
        description: 'Package description',
        price: '€29.99',
        validity_days: 30,
        region: 'Europe',
        status: 'draft',
        features: [
          '5G where available',
          'Free roaming',
          'Unlimited calls within EU'
        ],
        countries: [
          { code: 'DE', name: 'Germany' },
          { code: 'FR', name: 'France' }
        ],
        translations: {},
        order: packages.length
      };

      const data = await createComboPackage(newPackage);
      setMessage({
        type: 'success',
        text: 'New package created'
      });
      loadPackages();
      setEditingId(data.id);
    } catch (error) {
      console.error('Error creating package:', error);
      setMessage({
        type: 'error',
        text: 'Failed to create package'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Combo Packages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and reorder your combo package offerings
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
        >
          Add Package
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="packages">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {packages.map((pkg, index) => (
                <Draggable key={pkg.id} draggableId={pkg.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ComboPackageCard
                        plan="Europe +"
                        package={pkg}
                        isEditing={editingId === pkg.id}
                        onEdit={() => handleEdit(pkg)}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onDelete={() => handleDelete(pkg.id)}
                        onDuplicate={() => handleDuplicate(pkg)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {packages.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900">No packages yet</h3>
          <p className="mt-2 text-sm text-gray-500">Get started by adding a new package.</p>
          <button
            onClick={handleAddNew}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
          >
            Add Package
          </button>
        </div>
      )}
    </div>
  );
}