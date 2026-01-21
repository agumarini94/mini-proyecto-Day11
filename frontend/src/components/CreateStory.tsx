import React, { useState } from 'react';
import api from '../api/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const CreateStory = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Sacamos el usuario de Redux para saber quién publica
    const { user } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.post('/stories', {
                title,
                content,
                authorId: user?.id // Enviamos el ID del autor
            });
            setMessage('¡Historia publicada con éxito!');
            setTitle('');
            setContent('');
        } catch (err: any) {
            setMessage('Error al publicar la historia. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-base-200 shadow-xl rounded-box">
            <h2 className="text-2xl font-bold mb-6 text-center">Escribir Nueva Historia</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label font-semibold">Título de la historia</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Érase una vez..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label font-semibold">Contenido</label>
                    <textarea
                        className="textarea textarea-bordered h-40"
                        placeholder="Escribe aquí tu aventura..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>

                {message && (
                    <div className={`alert ${message.includes('éxito') ? 'alert-success' : 'alert-error'} shadow-lg`}>
                        <span>{message}</span>
                    </div>
                )}

                <button
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    Publicar Historia
                </button>
            </form>
        </div>
    );
};