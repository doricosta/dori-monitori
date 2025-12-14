import { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Terminal, ChevronDown } from 'lucide-react';

interface Log {
    id: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    timestamp: string;
    context?: any;
}

interface Project {
    id: string;
    name: string;
}

export default function Logs() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');

    // Fetch projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
                if (res.data.length > 0) {
                    setSelectedProject(res.data[0].id);
                }
            } catch (error) {
                console.error("Erro ao buscar projetos", error);
            }
        };
        fetchProjects();
    }, []);

    // Fetch logs when project changes
    useEffect(() => {
        if (!selectedProject) return;

        const fetchLogs = async () => {
            setLoading(true);
            try {
                // Assuming /logs endpoint accepts projectId
                const res = await api.get(`/logs?projectId=${selectedProject}`);
                setLogs(res.data.data || []);
            } catch (error) {
                console.error("Erro ao buscar logs", error);
                // Mock data if API fails or is not ready
                setLogs([
                    { id: '1', level: 'info', message: `Project ${selectedProject} started`, timestamp: new Date().toISOString() },
                    { id: '2', level: 'warn', message: 'High memory usage', timestamp: new Date().toISOString() },
                    { id: '3', level: 'error', message: 'Database connection failed', timestamp: new Date().toISOString() }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [selectedProject]);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'error': return 'text-red-500 bg-red-50 border-red-100';
            case 'warn': return 'text-amber-500 bg-amber-50 border-amber-100';
            case 'debug': return 'text-blue-500 bg-blue-50 border-blue-100';
            default: return 'text-slate-500 bg-slate-50 border-slate-100';
        }
    };

    const filteredLogs = logs.filter(log =>
        log.message.toLowerCase().includes(filter.toLowerCase()) ||
        log.level.includes(filter.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Logs</h1>
                    <p className="text-slate-500">Registros do sistema por projeto</p>
                </div>
                <div className="flex gap-4">
                    {/* Project Selector */}
                    <div className="relative">
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-indigo-500 font-medium shadow-sm cursor-pointer"
                        >
                            <option value="" disabled>Selecione um projeto</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar logs..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg outline-none focus:border-indigo-500 w-64 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl shadow-lg flex-1 overflow-hidden flex flex-col font-mono text-sm border border-slate-800">
                <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-slate-400">
                    <Terminal size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Console Output</span>
                    {selectedProject && <span className="text-xs text-slate-600 ml-auto">Project ID: {selectedProject}</span>}
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-1 custom-scrollbar">
                    {loading ? (
                        <div className="text-slate-500 italic">Carregando logs...</div>
                    ) : (
                        filteredLogs.map(log => (
                            <div key={log.id} className="flex gap-4 hover:bg-white/5 p-1 rounded transition-colors group">
                                <span className="text-slate-500 shrink-0 w-36 group-hover:text-slate-400 transition-colors">{new Date(log.timestamp).toLocaleString()}</span>
                                <span className={`uppercase font-bold text-xs px-1.5 py-0.5 rounded border w-16 text-center shrink-0 ${getLevelColor(log.level)} bg-opacity-10 border-opacity-20`}>
                                    {log.level}
                                </span>
                                <span className="text-slate-300 break-all group-hover:text-white transition-colors">{log.message}</span>
                            </div>
                        ))
                    )}
                    {!loading && filteredLogs.length === 0 && (
                        <div className="text-slate-600 italic">Nenhum log encontrado para este projeto.</div>
                    )}
                    {!selectedProject && !loading && (
                        <div className="text-slate-500 italic">Selecione um projeto para ver os logs.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
