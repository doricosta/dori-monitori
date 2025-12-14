import { useEffect, useState, type FormEvent } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Copy, ArrowRight, Loader2 } from 'lucide-react';

interface Project {
    id: string;
    name: string;
    apiKey: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [newProjectName, setNewProjectName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (error) {
            console.error("Erro ao buscar projetos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/projects', { name: newProjectName });
            setIsModalOpen(false);
            setNewProjectName('');
            fetchProjects();
        } catch (error) {
            alert('Erro ao criar projeto');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza?')) return;
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(p => p.id !== id));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('API Key Copiada!');
    };

    if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Projetos</h1>
                    <p className="text-slate-500">Gerencie suas chaves e monitore aplicações</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all">
                    <Plus size={18} /> Novo Projeto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div key={project.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow group">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl text-slate-800">{project.name}</h3>
                                <button onClick={() => handleDelete(project.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                                <code className="text-xs text-slate-600 font-mono truncate max-w-[150px]">{project.apiKey}</code>
                                <button onClick={() => copyToClipboard(project.apiKey)} className="text-slate-400 hover:text-indigo-600">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                        <Link to={`/projects/${project.id}/traces`} className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-50 hover:bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm transition-colors">
                            Ver Traces <ArrowRight size={16} />
                        </Link>
                    </div>
                ))}
            </div>

            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
                            <h3 className="text-lg font-bold mb-4">Novo Projeto</h3>
                            <form onSubmit={handleCreate}>
                                <input
                                    value={newProjectName}
                                    onChange={e => setNewProjectName(e.target.value)}
                                    placeholder="Nome do projeto"
                                    className="w-full border p-2 rounded-lg mb-4 outline-none focus:border-indigo-500"
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 px-4">Cancelar</button>
                                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Criar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
