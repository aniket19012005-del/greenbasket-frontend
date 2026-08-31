import { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { TextField, SelectField, TextAreaField } from './FormField';
import Button from './Button';
import ProductCardPreview from './ProductCardPreview';
import { categoryApi } from '../../services/productApi';
import { discountPercent } from '../../utils/format';

const emptyForm = {
  name: '', description: '', categoryId: '', vendorId: '', vendorName: '',
  price: '', originalPrice: '', unit: 'kg', stock: '', minOrder: 1, maxOrder: 10,
  organic: false, featured: false, available: true, images: ['https://images.unsplash.com/photo-1546470427-e26264be0b0d?auto=format&fit=crop&w=600&q=70'],
};

export default function ProductForm({ initial, vendors, showVendorSelect = false, onSubmit, submitting }) {
  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => { categoryApi.list().then(setCategories); }, []);

  const set = (key) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const discount = discountPercent(form.originalPrice, form.price);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name) nextErrors.name = 'Product name is required';
    if (!form.categoryId) nextErrors.categoryId = 'Please select a category';
    if (showVendorSelect && !form.vendorId) nextErrors.vendorId = 'Please select a vendor';
    if (!form.price || Number(form.price) <= 0) nextErrors.price = 'Enter a valid selling price';
    if (form.originalPrice && Number(form.originalPrice) < Number(form.price)) nextErrors.originalPrice = 'Original price must be ≥ selling price';
    if (form.stock === '' || Number(form.stock) < 0) nextErrors.stock = 'Stock must be 0 or more';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({ ...form, price: Number(form.price), originalPrice: Number(form.originalPrice || form.price), stock: Number(form.stock), rating: form.rating || 4.5 });
  };

  return (
    <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'flex-start' }}>
      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <TextField className="full" label="Product Name" placeholder="e.g. Fresh Tomato" value={form.name} error={errors.name} onChange={set('name')} />
          <TextAreaField className="full" label="Description" placeholder="Describe the product…" value={form.description} onChange={set('description')} />

          {showVendorSelect && (
            <SelectField label="Vendor" value={form.vendorId} error={errors.vendorId}
              onChange={(e) => { const v = vendors?.find((x) => x.id === e.target.value); setForm((f) => ({ ...f, vendorId: e.target.value, vendorName: v?.name || '' })); }}
              options={[{ value: '', label: 'Select vendor' }, ...(vendors || []).map((v) => ({ value: v.id, label: v.name }))]} />
          )}
          <SelectField label="Category" value={form.categoryId} error={errors.categoryId} onChange={set('categoryId')}
            options={[{ value: '', label: 'Select category' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />

          <div className="field full">
            <label>Product Images</label>
            <div className="image-drop"><ImagePlus size={22} style={{ marginBottom: 6 }} /><br />Click or drag images here to upload</div>
            <div className="preview-thumbs">{form.images.filter(Boolean).map((img, i) => <img key={i} src={img} alt="" />)}</div>
          </div>

          <TextField label="Selling Price (₹)" type="number" min="0" value={form.price} error={errors.price} onChange={set('price')} />
          <TextField label="Original Price (₹)" type="number" min="0" value={form.originalPrice} error={errors.originalPrice} onChange={set('originalPrice')}
            hint={discount > 0 ? `Automatically shows ${discount}% OFF` : 'Leave equal to selling price for no discount'} />

          <SelectField label="Unit" value={form.unit} onChange={set('unit')}
            options={['kg', 'gram', '250g', '500g', 'bunch', 'piece', 'dozen', 'litre'].map((u) => ({ value: u, label: u }))} />
          <TextField label="Stock Quantity" type="number" min="0" value={form.stock} error={errors.stock} onChange={set('stock')} />

          <TextField label="Minimum Order Qty" type="number" min="1" value={form.minOrder} onChange={set('minOrder')} />
          <TextField label="Maximum Order Qty" type="number" min="1" value={form.maxOrder} onChange={set('maxOrder')} />

          <div className="full" style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600 }}>
              <input type="checkbox" checked={form.organic} onChange={set('organic')} /> Organic
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600 }}>
              <input type="checkbox" checked={form.featured} onChange={set('featured')} /> Featured
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600 }}>
              <input type="checkbox" checked={form.available} onChange={set('available')} /> Available for sale
            </label>
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" variant="accent" loading={submitting}>Save Product</Button>
        </div>
      </form>

      <div>
        <div className="live-preview-note">Live preview — updates as you type</div>
        <ProductCardPreview form={form} discount={discount} />
      </div>
    </div>
  );
}
