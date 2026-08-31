import { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { EmptyState } from './States';

const PAGE_SIZE = 8;

/**
 * columns: [{ key, label, render?(row), sortable? }]
 */
export default function DataTable({ columns, rows, searchKeys = [], toolbarExtra, emptyTitle = 'No records found', emptyMessage }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = rows;
    if (query && searchKeys.length) {
      const q = query.toLowerCase();
      result = result.filter((row) => searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q)));
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey]; const bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return result;
  }, [rows, query, searchKeys, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div>
      <div className="table-toolbar">
        {searchKeys.length > 0 ? (
          <div className="search-bar" style={{ maxWidth: 280 }}>
            <Search size={16} />
            <input placeholder="Search…" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} aria-label="Search table" />
          </div>
        ) : <span />}
        {toolbarExtra}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage || 'Try adjusting your search or check back later.'} />
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key}>
                      {col.sortable ? (
                        <button
                          onClick={() => toggleSort(col.key)}
                          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'inherit', font: 'inherit', padding: 0 }}
                        >
                          {col.label} <ArrowUpDown size={12} />
                        </button>
                      ) : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, idx) => (
                  <tr key={row.id || idx}>
                    {columns.map((col) => (
                      <td key={col.key} data-label={col.label}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page"><ChevronLeft size={15} /></button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page"><ChevronRight size={15} /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
