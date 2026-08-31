import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/StatCard';
import ProductForm from '../../components/common/ProductForm';
import { LoadingState } from '../../components/common/States';
import productApi from '../../services/productApi';
import vendorApi from '../../services/vendorApi';
import useToast from '../../hooks/useToast';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();
  const [initial, setInitial] = useState(isEdit ? null : {});
  const [vendors, setVendors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    vendorApi.list().then((res) => setVendors(res.items || res));
    if (isEdit) productApi.getById(id).then(setInitial);
  }, [id, isEdit]);

  if (isEdit && !initial) return <LoadingState label="Loading product…" />;

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (isEdit) await productApi.update(id, payload);
      else await productApi.create(payload);
      toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully`);
      navigate('/admin/products');
    } catch {
      toast.error('Could not save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Product' : 'Add New Product'} subtitle="Admin can manage products for any vendor" />
      <ProductForm initial={initial} vendors={vendors} showVendorSelect onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
