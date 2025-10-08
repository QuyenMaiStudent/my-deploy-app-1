// @ts-nocheck
import { Link, router, useForm } from '@inertiajs/react';

export default function Index({ links, q, base }) {
    const { data, setData, processing, post, reset } = useForm({ long_url: '' });

    const onSubmit = (e) => {
        e.preventDefault();
        post('/links', { onSuccess: () => reset() });
    };

    const search = (e) => {
        e.preventDefault();
        const val = new FormData(e.target).get('q');
        router.get('/', { q: val }, { preserveState: true });
    };

    const remove = (id) => {
        if (!confirm('Bạn có chắc muốn xóa liên kết này?')) return;
        router.delete(`/links/${id}`);
    };

    function labelText(label) {
        if (label.includes('Previous') || label.includes('<<')) return '<<';
        if (label.includes('Next') || label.includes('>>')) return '>>';
        return label;
    }

    return (
        <div className="container">
            <h1 className="title">URL Shortener</h1>

            <div className="card">
                <form className="form-row" onSubmit={onSubmit}>
                    <input
                        type="url"
                        className="input"
                        placeholder="https://example.com/..."
                        value={data.long_url}
                        onChange={(e) => setData('long_url', e.target.value)}
                    />
                    <button className="btn btn-primary" disabled={processing}>Shorten</button>
                </form>

                <form className="form-row search-row" onSubmit={search}>
                    <input name="q" defaultValue={q ?? ''} className="input" placeholder="Search long URL..." />
                    <button className="btn">Search</button>
                </form>

                <table className="my-table">
                    <thead>
                        <tr>
                            <th>Short URL</th>
                            <th>Long URL</th>
                            <th>Clicks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {links.data.map((l) => (
                            <tr key={l.id}>
                                <td className="short-cell">
                                    <a href={`${base}/r/${l.code}`} target="_blank" rel="noreferrer" className="short-link">
                                        {base}/r/{l.code}
                                    </a>
                                </td>
                                <td className="long-url-cell" title={l.long_url}>{l.long_url}</td>
                                <td className="center">{l.clicks}</td>
                                <td className="center">
                                    <button type="button" className="btn btn-danger" onClick={() => remove(l.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination">
                    {links.links.map((p, i) =>
                        p.url ? (
                            <Link key={i} href={p.url} preserveScroll className="page-item">
                                <span>{labelText(p.label)}</span>
                            </Link>
                        ) : (
                            <span key={i} className="page-item disabled">{labelText(p.label)}</span>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}

