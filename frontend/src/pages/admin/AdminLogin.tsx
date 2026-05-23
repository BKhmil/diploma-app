import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { strapiLogin } from '../../services/strapi';

export default function AdminLogin() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { jwt } = await strapiLogin(identifier, password);
            localStorage.setItem('strapiJwt', jwt);
            navigate('/admin');
        } catch (err: any) {
            setError(err?.message || 'Невірний логін або пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <KeyRound className="w-8 h-8 text-dnu-blue" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Вхід до CMS</h1>
                    <p className="text-gray-500 text-sm mt-2">Панель керування контентом сайту ЦНО</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email або логін</label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                            placeholder="admin@example.com"
                            required
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            placeholder="Пароль"
                            required
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-dnu-blue text-white py-3 rounded-xl font-bold hover:bg-dnu-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Вхід...' : 'Увійти в панель'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-sm text-dnu-blue hover:underline">Повернутись на сайт</a>
                </div>
            </div>
        </div>
    );
}
