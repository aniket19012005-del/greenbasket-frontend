import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { TextField } from '../../components/common/FormField';
import { LoadingState } from '../../components/common/States';
import { categoryApi } from '../../services/productApi';
import useToast from '../../hooks/useToast';

export default function AdminCategories() {
  const [categories, setCategories] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', emoji: '🥬' });
  const toast = useToast();

  useEffect(() => { categoryApi.list().then(setCategories); }, []);

  if (!categories) return <LoadingState label="Loading categories…" />;

  const save = (e) => {
    e.preventDefault();
    setCategories((prev) => [...prev, { ...form, id: `cat-${Date.now()}`, productCount: 0 }]);
    setForm({ name: '', emoji: '🥬' });
    setModalOpen(false);
    toast.success('Category added successfully');
  };

  const remove = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.show('Category removed');
  };

  const columns = [
    { key: 'emoji', label: '', render: (r) => <span style={{ fontSize: 22 }}>{r.emoji}</span> },
    { key: 'name', label: 'Category Name', sortable: true },
    { key: 'productCount', label: 'Products', sortable: true },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="row-actions">
        <button className="icon-btn" aria-label="Edit"><Pencil size={15} /></button>
        <button className="icon-btn" onClick={() => remove(r.id)} aria-label="Delete"><Trash2 size={15} color="var(--gb-red)" /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Categories" subtitle={`${categories.length} categories`} actions={<Button variant="accent" icon={Plus} onClick={() => setModalOpen(true)}>Add Category</Button>} />
      <div className="card" style={{ padding: 18 }}>
        <DataTable columns={columns} rows={categories} searchKeys={['name']} emptyTitle="No categories yet" />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Category">
        <form onSubmit={save}>
          <TextField label="Category Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <TextField label="Emoji Icon" value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} />
          <div className="form-actions"><Button type="submit" variant="accent">Save Category</Button></div>
        </form>
      </Modal>
    </div>
  );
}
