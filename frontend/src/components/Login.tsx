import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import api from '../api/axios';
import { RootState } from '../store';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            console.log("Intentando login con:", email);
            const response = await api.post('/user/login', { email, password });

            // Guardamos el token en localStorage para que el interceptor lo use
            if (response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
            }

            dispatch(loginSuccess({
                user: response.data.user,
                token: response.data.accessToken
            }));

            console.log("Login exitoso!");
        } catch (err: any) {
            console.error("Error en el login:", err.response?.data || err.message);
            dispatch(loginFailure(err.response?.data?.message || 'Credenciales inválidas'));
        }
    };

    return (
        <div className="card w-96 bg-base-100 shadow-2xl">
            <form onSubmit={handleSubmit} className="card-body">
                <h2 className="card-title text-2xl font-bold text-center block">Iniciar Sesión</h2>
                <div className="form-control mt-4">
                    <input
                        type="email"
                        placeholder="Email (peter@test.com)"
                        className="input input-bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-control mt-4">
                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-error text-sm mt-2">{error}</p>}
                <div className="form-control mt-6">
                    <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </div>
            </form>
        </div>
    );
};