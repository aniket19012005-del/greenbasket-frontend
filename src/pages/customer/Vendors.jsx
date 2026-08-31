import { useEffect, useState } from 'react';
import VendorCard from '../../components/customer/VendorCard';
import { EmptyState } from '../../components/common/States';
import vendorApi from '../../services/vendorApi';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorApi.list({ status: 'approved' }).then((res) => { setVendors(res.items || res); setLoading(false); });
  }, []);

  return (
    <div className="container section">
      <div className="page-header"><div><h1>Our Vendors</h1><p className="sub">Trusted local sellers powering GreenBasket</p></div></div>
      {loading ? (
        <div className="product-grid">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 14 }} />)}</div>
      ) : vendors.length === 0 ? (
        <EmptyState title="No vendors available" message="Check back soon for new vendors." />
      ) : (
        <div className="product-grid">{vendors.map((v) => <VendorCard key={v.id} vendor={v} />)}</div>
      )}
    </div>
  );
}
