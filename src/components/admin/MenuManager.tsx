import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import { MenuItem } from '../../types';

interface MenuManagerProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  coffee: 'Coffee & Brews',
  starters: 'Tandoor & Starters',
  mains: 'Pizzas & Mains',
  beverages: 'Beverages & Shakes',
  bakery: 'Baked & Desserts',
  filter: 'Filter Coffee',
  brunch: 'All-Day Brunch',
};

export const MenuManager: React.FC<MenuManagerProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleStockStatus } = useCafe();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // New Dish Form State
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'coffee' as MenuItem['category'],
    categoryLabel: 'Coffee & Brews',
    description: '',
    price: '₹190',
    tag: '',
    image: '/images/dishes/classic-flat-white.png',
  });

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'starters', label: 'Tandoor & Starters' },
    { id: 'mains', label: 'Pizzas & Mains' },
    { id: 'coffee', label: 'Coffee & Brews' },
    { id: 'beverages', label: 'Beverages & Shakes' },
    { id: 'bakery', label: 'Baked & Desserts' },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name.trim()) return;

    const catLabel = CATEGORY_LABELS[newDish.category] || 'Specialty Item';

    addMenuItem({
      ...newDish,
      categoryLabel: catLabel,
      available: true,
      stockStatus: 'in_stock',
    });

    setNewDish({
      name: '',
      category: 'coffee',
      categoryLabel: 'Coffee & Brews',
      description: '',
      price: '₹190',
      tag: '',
      image: '/images/dishes/classic-flat-white.png',
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const catLabel = CATEGORY_LABELS[editingItem.category] || editingItem.categoryLabel || 'Specialty Item';
    updateMenuItem(editingItem.id, {
      ...editingItem,
      categoryLabel: catLabel,
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-border/80 shadow-warm-sm">
        <div>
          <h2 className="text-lg font-sans font-semibold text-espresso">Menu & Kitchen Inventory</h2>
          <p className="text-xs font-sans text-muted-foreground">
            {menuItems.length} active menu offerings &middot; Changes update live on the public site
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-all active:scale-[0.98] shadow-warm-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-warm" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search dish or ingredient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/80 bg-white text-xs font-sans focus:outline-none focus:border-amber-warm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-espresso text-cream font-medium'
                  : 'bg-white text-muted-foreground hover:bg-surface border border-border/70'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const stock = item.stockStatus || 'in_stock';
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between ${
                stock === 'out_of_stock'
                  ? 'border-rose-300 bg-rose-50/20 opacity-80'
                  : 'border-border/80 hover:border-espresso/40 shadow-warm-sm'
              }`}
            >
              <div>
                {/* Photo and Badges */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-oat mb-3.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.tag && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-sans font-medium text-espresso shadow-warm-sm">
                      {item.tag}
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-amber-warm text-cream font-mono font-semibold text-xs shadow-warm-sm">
                    {item.price}
                  </span>
                </div>

                {/* Details */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                      {item.categoryLabel}
                    </span>
                    <h4 className="text-base font-sans font-semibold text-espresso">
                      {item.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs font-sans text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Actions & Live Stock Switch */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                {/* Stock Toggle Button */}
                <button
                  onClick={() => toggleStockStatus(item.id)}
                  title="Click to cycle stock status (In Stock -> Low Stock -> Sold Out)"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors active:scale-95 ${
                    stock === 'in_stock'
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : stock === 'low_stock'
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}
                >
                  {stock === 'in_stock' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {stock === 'low_stock' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {stock === 'out_of_stock' && <XCircle className="w-3.5 h-3.5" />}
                  <span className="capitalize font-medium">
                    {stock === 'in_stock' ? 'In Stock' : stock === 'low_stock' ? 'Low Stock' : "86'd (Sold Out)"}
                  </span>
                </button>

                {/* Edit & Delete Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-espresso hover:bg-surface transition-colors"
                    title="Edit dish"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${item.name}" from menu?`)) {
                        deleteMenuItem(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove dish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-deep/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-warm-lg border border-border p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-5">
              <h3 className="font-sans font-semibold text-lg text-espresso">Add New Dish</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-muted-foreground hover:text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Avocado Toast on Sourdough"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                    Category *
                  </label>
                  <select
                    value={newDish.category}
                    onChange={(e) =>
                      setNewDish({ ...newDish, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                  >
                    <option value="starters">Tandoor & Starters</option>
                    <option value="mains">Pizzas & Mains</option>
                    <option value="coffee">Coffee & Brews</option>
                    <option value="beverages">Beverages & Shakes</option>
                    <option value="bakery">Baked & Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹240"
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Badge Tag (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chef's Special / Fresh Batch"
                  value={newDish.tag}
                  onChange={(e) => setNewDish({ ...newDish, tag: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={newDish.image}
                  onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief tasting notes or ingredients..."
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-sans text-muted-foreground hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-colors"
                >
                  Add to Live Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dish Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-deep/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-warm-lg border border-border p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-5">
              <h3 className="font-sans font-semibold text-lg text-espresso">Edit Dish</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-full text-muted-foreground hover:text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                  >
                    <option value="starters">Tandoor & Starters</option>
                    <option value="mains">Pizzas & Mains</option>
                    <option value="coffee">Coffee & Brews</option>
                    <option value="beverages">Beverages & Shakes</option>
                    <option value="bakery">Baked & Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={editingItem.tag || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-sans text-muted-foreground hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
