import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/StatCard';
import ProductForm from '../../components/common/ProductForm';
import { LoadingState } from '../../components/common/States';
import productApi from '../../services/productApi';
import vendorPanelApi from '../../services/vendorPanelApi';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

export default function VendorProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const vendorId = user?.vendorId || 'v1';
  const [initial, setInitial] = useState(isEdit ? null : { vendorId, vendorName: user?.name });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (isEdit) productApi.getById(id).then(setInitial); }, [id, isEdit]);

  if (isEdit && !initial) return <LoadingState label="Loading product…" />;

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      await vendorPanelApi.saveProduct({ ...payload, id, vendorId, vendorName: initial?.vendorName || 'FreshFarm' });
      toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully`);
      navigate('/vendor/products');
    } catch {
      toast.error('Could not save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Product' : 'Add New Product'} subtitle="This product will be listed on your storefront" />
      <ProductForm initial={initial} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
