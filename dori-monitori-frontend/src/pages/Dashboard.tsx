import { useEffect, useState } from 'react';
import api from '../services/api';
import { Activity, CheckCircle, AlertCircle, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';

interface DashboardData {
    message: string;
    resumo: {
        projectsCount: number;
        tracesCount: number;
        successRate: string;
        errorRate: string;
        avgDurationMs: string;
        firstTrace: string;
        lastTrace: string;
    };
    projects: {
        id: number;
        name: string;
        traces_24h: number;
        avg_duration_24h: string;
    }[];
    topEndpoints: {
        path: string;
        requests: number;
        avgDuration: string;
        p95Duration: string;
    }[];
    timeline: {
        hour: string;
        requests: number;
        avgDuration: string;
        errors: number;
    }[];
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard');
                setData(res.data.dados); // Ajuste conforme a estrutura real: res.data.dados
            } catch (error) {
                console.error("Erro ao buscar dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${color} text-white shadow-lg shadow-indigo-500/20`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
            </div>
        </div>
    );

    if (loading) return <div className="p-10 text-center text-slate-400 animate-pulse">Carregando dashboard...</div>;
    if (!data) return <div className="p-10 text-center text-slate-400">Erro ao carregar dados.</div>;

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
                <p className="text-slate-500">Visão geral do sistema e performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Requisições"
                    value={data.resumo.tracesCount}
                    icon={Activity}
                    color="bg-indigo-500"
                    subtext={`${data.resumo.projectsCount} Projetos ativos`}
                />
                <StatCard
                    title="Taxa de Sucesso"
                    value={data.resumo.successRate}
                    icon={CheckCircle}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Taxa de Erros"
                    value={data.resumo.errorRate}
                    icon={AlertCircle}
                    color="bg-red-500"
                />
                <StatCard
                    title="Duração Média"
                    value={`${data.resumo.avgDurationMs}ms`}
                    icon={Clock}
                    color="bg-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Projetos Ativos */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-500" /> Performance por Projeto (24h)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Projeto</th>
                                    <th className="px-4 py-3">Requisições</th>
                                    <th className="px-4 py-3 rounded-r-lg">Duração Média</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.projects.map((proj) => (
                                    <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-slate-700">{proj.name}</td>
                                        <td className="px-4 py-4 text-slate-600">{proj.traces_24h}</td>
                                        <td className="px-4 py-4 text-slate-600 font-mono text-sm">{proj.avg_duration_24h}ms</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Endpoints */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <ArrowUpRight size={20} className="text-emerald-500" /> Top Endpoints
                    </h3>
                    <div className="space-y-4">
                        {data.topEndpoints.map((endpoint, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded break-all">
                                        {endpoint.path}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 mt-3">
                                    <span>{endpoint.requests} reqs</span>
                                    <span className="font-mono text-xs text-slate-500 self-center">{endpoint.avgDuration}ms avg</span>
                                </div>
                            </div>
                        ))}
                        {data.topEndpoints.length === 0 && <p className="text-slate-400 text-sm">Sem dados recentes.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
