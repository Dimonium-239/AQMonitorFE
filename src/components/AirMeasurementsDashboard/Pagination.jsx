export function Pagination({ pageNum, setPageNum, pageSize, setPageSize, totalItems }) {
    const pageOptions = [5, 10, 15, 25];
    const totalPages = Math.ceil(totalItems / pageSize);

    const getPages = () => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        let start = pageNum - 1;
        let end = pageNum + 1;

        if (start < 1) {
            start = 1;
            end = 3;
        }
        if (end > totalPages) {
            end = totalPages;
            start = totalPages - 2;
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pages = getPages();

    const buttonStyle = (active = false, disabled = false) => ({
        padding: '6px 12px',
        margin: '0 2px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        // backgroundColor: active ? '#007bff' : disabled ? '#eee' : '#fff',
        // color: active ? '#fff' : disabled ? '#999' : '#000',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: active ? 'bold' : 'normal'
    });

    return (
        <div className={"no-print"} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px' }}>
            {/* First page */}
            <button
                style={buttonStyle(false, pageNum === 1)}
                onClick={() => setPageNum(1)}
                disabled={pageNum === 1}
            >
                &lt;&lt;
            </button>

            {/* Previous page */}
            <button
                style={buttonStyle(false, pageNum === 1)}
                onClick={() => setPageNum(Math.max(1, pageNum - 1))}
                disabled={pageNum === 1}
            >
                &lt;
            </button>

            {/* Page numbers */}
            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => setPageNum(p)}
                    style={buttonStyle(p === pageNum)}
                >
                    {p}
                </button>
            ))}

            {/* Next page */}
            <button
                style={buttonStyle(false, pageNum === totalPages)}
                onClick={() => setPageNum(Math.min(totalPages, pageNum + 1))}
                disabled={pageNum === totalPages}
            >
                &gt;
            </button>

            {/* Last page */}
            <button
                style={buttonStyle(false, pageNum === totalPages)}
                onClick={() => setPageNum(totalPages)}
                disabled={pageNum === totalPages}
            >
                &gt;&gt;
            </button>

            {/* Page size dropdown */}
            <select
                value={pageSize}
                onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setPageSize(newSize);
                    setPageNum(1); // reset to first page
                }}
                style={{ marginLeft: '16px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
                {pageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}
