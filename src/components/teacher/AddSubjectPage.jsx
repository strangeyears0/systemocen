// src/components/teacher/AddSubjectPage.jsx
import { useState } from 'react';
import Header from '../shared/Header';
import TeacherSidebar from '../shared/TeacherSidebar';
import { subjectsApi } from '../../api/subjects';
import { useNavigate } from 'react-router-dom';

export default function AddSubjectPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleAdd = async () => {
        if (name.trim()) {
            setIsLoading(true);
            try {
                await subjectsApi.create({
                    name,
                    description
                });
                // Navigate back to subjects list on success
                navigate('/teacher/subjects');
            } catch (error) {
                console.error("Failed to create subject", error);
                alert("Wystąpił błąd przy tworzeniu przedmiotu.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex h-screen w-full">
            <TeacherSidebar />
            <main className="flex-1 overflow-y-auto flex flex-col">
                <Header title="Dodaj Przedmiot" />
                <div className="p-8 flex-1">
                    <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800/50">
                        <div className="mb-8 space-y-4">
                            <div>
                                <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                                    Nazwa przedmiotu
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                                    className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="np. Matematyka"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                                    Opis (opcjonalnie)
                                </label>
                                <input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="np. Nauka matematyki"
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={isLoading || !name.trim()}
                                className="w-full bg-[#D0BB95] text-white px-5 py-3 rounded-lg hover:bg-[#c9ad86] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                ) : (
                                    "Dodaj Przedmiot"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
