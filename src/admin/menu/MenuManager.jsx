import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from '../services/supabaseService';

const MenuItemForm = ({ item, onSave, onCancel }) => {
  const defaultTranslations = {
    en: { name: '' },
    sq: { name: '' },
    fr: { name: '' },
    de: { name: '' },
    tr: { name: '' }
  };

  const [formData, setFormData] = useState({
    name: item?.name || '',
    href: item?.href || '',
    icon: item?.icon || '',
    parent_id: item?.parent_id || null,
    order: item?.order || 0,
    status: item?.status || 'active',
    translations: item?.translations || defaultTranslations
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL</label>
        <input
          type="text"
          value={formData.href}
          onChange={(e) => setFormData({ ...formData, href: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Icon</label>
        <input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Order</label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Translations */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Translations</h3>
        {Object.entries(formData.translations).map(([lang, content]) => (
          <div key={lang} className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700">
              {lang === 'en' ? 'English' : 
               lang === 'sq' ? 'Albanian' : 
               lang === 'fr' ? 'French' : 
               lang === 'de' ? 'German' :
               lang === 'tr' ? 'Turkish' :
               lang}
            </label>
            <input
              type="text"
              value={content.name}
              onChange={(e) => setFormData({
                ...formData,
                translations: {
                  ...formData.translations,
                  [lang]: { name: e.target.value }
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
        >
          Save
        </button>
      </div>
    </form>
  );
};

const MenuItem = ({ item, onEdit, onDelete, onAddSubmenu, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-2">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {item.icon && (
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#690d89]/10 text-[#690d89]">
              <i className={`fas fa-${item.icon}`}></i>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.href}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="text-[#690d89] hover:text-[#8B5CF6]"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
          <button
            onClick={() => onAddSubmenu(item)}
            className="text-[#690d89] hover:text-[#8B5CF6]"
          >
            Add Submenu
          </button>
          {item.children?.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>
      </div>
      {isExpanded && item.children?.length > 0 && (
        <div className="pl-8 pr-4 pb-4">
          {item.children.map(child => (
            <MenuItem
              key={child.id}
              item={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubmenu={onAddSubmenu}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_menu_items')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      // Organize items into tree structure
      const items = data || [];
      const tree = items.filter(item => !item.parent_id).map(item => ({
        ...item,
        children: items.filter(child => child.parent_id === item.id)
      }));

      setMenuItems(tree);
    } catch (error) {
      console.error('Error loading menu items:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load menu items'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const { error } = await supabase
        .from('cms_menu_items')
        .upsert({
          ...formData,
          children: formData.children || []
        });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Menu item saved successfully!'
      });
      setEditingItem(null);
      loadMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save menu item'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cms_menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Menu item deleted successfully!'
      });
      loadMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete menu item'
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
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your website's navigation menu structure
          </p>
        </div>
        <button
          onClick={() => setEditingItem({})}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
        >
          Add Menu Item
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {editingItem ? (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {editingItem.id ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <MenuItemForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => setEditingItem(null)}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {menuItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              onEdit={setEditingItem}
              onDelete={handleDelete}
              onAddSubmenu={(parent) => setEditingItem({ parent_id: parent.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}