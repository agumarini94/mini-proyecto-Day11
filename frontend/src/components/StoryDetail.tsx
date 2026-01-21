import React from 'react';

interface StoryDetailProps {
    story: any;
    onBack: () => void;
}

export const StoryDetail = ({ story, onBack }: StoryDetailProps) => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-base-100 shadow-2xl rounded-xl border border-primary/20">
            <button onClick={onBack} className="btn btn-outline btn-sm mb-6">
                ← Volver al Feed
            </button>

            <article>
                <h1 className="text-4xl font-extrabold mb-4 text-primary">{story.title}</h1>
                <div className="flex items-center gap-2 mb-8 text-sm opacity-70">
                    <div className="badge badge-secondary">Autor ID: {story.authorId}</div>
                    <span>•</span>
                    <span>Publicado recientemente</span>
                </div>

                <p className="text-lg leading-relaxed whitespace-pre-line text-justify">
                    {story.content}
                </p>
            </article>

            <div className="divider mt-12">Fin de la historia</div>
        </div>
    );
};