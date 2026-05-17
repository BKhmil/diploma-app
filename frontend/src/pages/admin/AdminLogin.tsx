import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Простий хардкод пароль для демо ЦМС
        if (password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin');
        } else {
            setError(true);
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Логін</label>
                        <input
                            type="text"
                            defaultValue="admin"
                            disabled
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Пароль (введіть admin123)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            placeholder="Пароль"
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        />
                        {error && <p className="text-red-500 text-xs mt-1">Неправильний пароль</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-dnu-blue text-white py-3 rounded-xl font-bold hover:bg-dnu-dark transition-colors"
                    >
                        Увійти в панель
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-sm text-dnu-blue hover:underline">Повернутись на сайт</a>
                </div>
            </div>
        </div>
    );
}
