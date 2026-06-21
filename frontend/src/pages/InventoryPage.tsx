import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Package, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { productsApi, categoriesApi, transactionsApi } from '../services/api';
import type { Product, Category } from '../types';

const emptyProduct = {
  product_name: '',
  category_id: 0,
  sku: '',
  description: '',
  price: 0,
  current_quantity: 0,
  minimum_stock_level: 10,
};

export default function InventoryPage() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [stockForm, setStockForm] = useState({ transaction_type: 'stock_in', quantity: 1, remarks: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
    Promise.all([productsApi.list(), categoriesApi.list()])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ ...emptyProduct, category_id: categories[0]?.category_id || 0 });
    setError('');
    setShowProductModal(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      product_name: product.product_name,
      category_id: product.category_id,
      sku: product.sku,
      description: product.description,
      price: product.price,
      current_quantity: product.current_quantity,
      minimum_stock_level: product.minimum_stock_level,
    });
    setError('');
    setShowProductModal(true);
  };

  const openStock = (product: Product, type: 'stock_in' | 'stock_out') => {
    setStockProduct(product);
    setStockForm({ transaction_type: type, quantity: 1, remarks: '' });
    setError('');
    setShowStockModal(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editProduct) {
        await productsApi.update(editProduct.product_id, form);
      } else {
        await productsApi.create(form);
      }
      setShowProductModal(false);
      fetchData();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(typeof message === 'string' ? message : 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockProduct) return;
    setError('');
    setSubmitting(true);
    try {
      await transactionsApi.create({
        product_id: stockProduct.product_id,
        transaction_type: stockForm.transaction_type,
        quantity: stockForm.quantity,
        remarks: stockForm.remarks,
      });
      setShowStockModal(false);
      fetchData();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(typeof message === 'string' ? message : 'Stock update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete product "${product.product_name}"?`)) return;
    try {
      await productsApi.delete(product.product_id);
      fetchData();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      alert(typeof message === 'string' ? message : 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Inventory"
        description={isAdmin ? 'Manage products and stock levels' : 'View product inventory (read-only)'}
        actions={
          isAdmin && (
            <button onClick={openCreate} className="btn-primary">
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          )
        }
      />

      <div className="card overflow-hidden !p-0">
        {products.length === 0 ? (
          <EmptyState
            icon={<Package className="h-8 w-8" />}
            title="No products yet"
            description="Add your first product to start tracking inventory."
            action={isAdmin ? <button onClick={openCreate} className="btn-primary">Add Product</button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Status</th>
                  {isAdmin && <th className="px-6 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.product_name}</p>
                        {product.description && (
                          <p className="mt-0.5 max-w-xs truncate text-xs text-gray-500">{product.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category_name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-gray-600">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{product.current_quantity}</td>
                    <td className="px-6 py-4"><Badge status={product.status || 'in_stock'} /></td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openStock(product, 'stock_in')}
                            title="Stock In"
                            className="rounded-lg p-2 text-gray-400 hover:bg-green-50 hover:text-green-600"
                          >
                            <ArrowDownToLine className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openStock(product, 'stock_out')}
                            title="Stock Out"
                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <ArrowUpFromLine className="h-4 w-4" />
                          </button>
                          <button onClick={() => openEdit(product)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(product)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        title={editProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Product Name</label>
              <input required value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">SKU</label>
              <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
              <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })} className="input-field">
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Price</label>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Current Quantity</label>
              <input required type="number" min="0" value={form.current_quantity} onChange={(e) => setForm({ ...form, current_quantity: Number(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Minimum Stock Level</label>
              <input required type="number" min="0" value={form.minimum_stock_level} onChange={(e) => setForm({ ...form, minimum_stock_level: Number(e.target.value) })} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowProductModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title={stockForm.transaction_type === 'stock_in' ? 'Stock In' : 'Stock Out'}
      >
        <form onSubmit={handleStockSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-900">{stockProduct?.product_name}</p>
            <p className="text-xs text-gray-500">Current stock: {stockProduct?.current_quantity} units</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Quantity</label>
            <input
              required
              type="number"
              min="1"
              value={stockForm.quantity}
              onChange={(e) => setStockForm({ ...stockForm, quantity: Number(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              rows={2}
              value={stockForm.remarks}
              onChange={(e) => setStockForm({ ...stockForm, remarks: e.target.value })}
              className="input-field"
              placeholder="Optional notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowStockModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
