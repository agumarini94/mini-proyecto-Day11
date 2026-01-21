import React, { useEffect, useState } from 'react';
import api from '../api/axios';

// Definimos qué props recibe el componente
interface StoryListProps {
    onSelectStory: (story: any) => void;
}

export const StoryList = ({ onSelectStory }: StoryListProps) => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const res = await api.get('/stories');
                // Si el backend devuelve un array directamente
                setStories(res.data);
            } catch (err) {
                console.error("Error cargando historias:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-10">
                <span className="loading loading-dots loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.length === 0 ? (
                <div className="col-span-full text-center py-10 opacity-60">
                    <p className="text-xl italic">No hay historias disponibles todavía.</p>
                    <p>¡Sé el primero en escribir una!</p>
                </div>
            ) : (
                stories.map((story: any) => (
                    <div
                        key={story.id}
                        className="card bg-base-100 shadow-xl border border-primary/10 hover:border-primary/40 transition-all duration-300"
                    >
                        <div className="card-body">
                            <h2 className="card-title text-primary">{story.title}</h2>
                            <p className="line-clamp-3 text-sm opacity-80">{story.content}</p>

                            <div className="card-actions justify-end mt-4">
                                <button
                                    className="btn btn-primary btn-sm btn-outline"
                                    onClick={() => onSelectStory(story)}
                                >
                                    Leer más
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};