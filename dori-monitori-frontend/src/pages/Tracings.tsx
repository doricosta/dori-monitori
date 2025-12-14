import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Clock, X, FileJson } from 'lucide-react';

interface Trace {
    trace_id: string;
    project_api_key: string;
    status_code: number;
    metodo: string;
    path: string;
    duracao_ms: number;
    tamanho: number;
    timestamp: string;
    ip: string;
    user_agent: string;
    metadata: any;
    corpo: any;
    query: any;
    created_at: string;
}

export default function Tracings() {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');

    const [traces, setTraces] = useState<Trace[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);

    useEffect(() => {
        const fetchTraces = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/tracings?projectID=${id}&page=${page}&limit=20`);
                setTraces(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTraces();
    }, [id, page]);

    const getStatusColor = (code: number) => {
        if (code >= 500) return 'bg-red-100 text-red-700 border-red-200';
        if (code >= 400) return 'bg-amber-100 text-amber-700 border-amber-200';
        if (code >= 200) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const formatJson = (data: any) => {
        if (typeof data === 'object' && data !== null) {
            return JSON.stringify(data, null, 2);
        }
        try {
            return JSON.stringify(JSON.parse(data), null, 2);
        } catch {
            return String(data) || '{}';
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link to="/projects" className="p-2 border rounded-lg hover:bg-white text-slate-500"><ArrowLeft size={20} /></Link>
                <h1 className="text-2xl font-bold text-slate-800">Monitoramento de Traces</h1>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-slate-400">Carregando traces...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Método / Path</th>
                                <th className="px-6 py-4">Duração</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 text-right">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {traces.map((trace) => (
                                <tr key={trace.trace_id} onClick={() => setSelectedTrace(trace)}
                                    className="hover:bg-indigo-50/50 cursor-pointer transition group">
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(trace.status_code)}`}>
                                            {trace.status_code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs text-slate-700">{trace.metodo}</span>
                                            <span className="text-sm text-slate-500 truncate max-w-xs font-mono" title={trace.path}>{trace.path}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {trace.duracao_ms}ms</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(trace.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 font-medium text-sm hover:underline">Ver</button>
                                    </td>
                                </tr>
                            ))}
                            {traces.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum log encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between">
                    <button disabled={page <= 1} onClick={() => setSearchParams({ page: (page - 1).toString() })}
                        className="px-4 py-2 bg-white border rounded disabled:opacity-50">Anterior</button>
                    <span className="self-center text-sm text-slate-500">Página {page}</span>
                    <button onClick={() => setSearchParams({ page: (page + 1).toString() })}
                        className="px-4 py-2 bg-white border rounded">Próxima</button>
                </div>
            </div>

            {selectedTrace && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setSelectedTrace(null)}></div>
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slideIn">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Detalhes da Requisição</h3>
                            <button onClick={() => setSelectedTrace(null)}><X className="text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded border">
                                    <span className="text-xs uppercase font-bold text-slate-400">Trace ID</span>
                                    <p className="font-mono text-xs break-all text-slate-700">{selectedTrace.trace_id}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border">
                                    <span className="text-xs uppercase font-bold text-slate-400">Status</span>
                                    <p className={`font-mono text-sm font-bold ${selectedTrace.status_code >= 400 ? 'text-red-600' : 'text-emerald-600'}`}>{selectedTrace.status_code}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border">
                                    <span className="text-xs uppercase font-bold text-slate-400">Método</span>
                                    <p className="font-mono text-sm text-slate-700">{selectedTrace.metodo}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border">
                                    <span className="text-xs uppercase font-bold text-slate-400">Duração</span>
                                    <p className="font-mono text-sm text-slate-700">{selectedTrace.duracao_ms}ms</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border">
                                    <span className="text-xs uppercase font-bold text-slate-400">Tamanho</span>
                                    <p className="font-mono text-sm text-slate-700">{selectedTrace.tamanho} bytes</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border">
                                    <span className="text-xs uppercase font-bold text-slate-400">IP</span>
                                    <p className="font-mono text-sm text-slate-700">{selectedTrace.ip}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border col-span-2">
                                    <span className="text-xs uppercase font-bold text-slate-400">Path</span>
                                    <p className="font-mono text-sm text-slate-700 break-all">{selectedTrace.path}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border col-span-2">
                                    <span className="text-xs uppercase font-bold text-slate-400">Timestamp</span>
                                    <p className="font-mono text-sm text-slate-700">{selectedTrace.timestamp}</p>
                                </div>
                            </div>

                            <div>
                                <span className="text-xs uppercase font-bold text-slate-400 mb-2 block flex gap-2 items-center"><FileJson size={14} /> Body</span>
                                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs overflow-auto font-mono">
                                    {formatJson(selectedTrace.corpo)}
                                </pre>
                            </div>

                            <div>
                                <span className="text-xs uppercase font-bold text-slate-400 mb-2 block">Query Params</span>
                                <pre className="bg-slate-100 text-slate-600 p-3 rounded-lg text-xs overflow-auto font-mono">
                                    {formatJson(selectedTrace.query)}
                                </pre>
                            </div>

                            <div>
                                <span className="text-xs uppercase font-bold text-slate-400 mb-2 block">Metadata</span>
                                <pre className="bg-slate-100 text-slate-600 p-3 rounded-lg text-xs overflow-auto font-mono">
                                    {formatJson(selectedTrace.metadata)}
                                </pre>
                            </div>

                            <div>
                                <span className="text-xs uppercase font-bold text-slate-400 mb-1 block">User Agent</span>
                                <p className="text-xs text-slate-600 break-words border p-2 rounded">{selectedTrace.user_agent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
