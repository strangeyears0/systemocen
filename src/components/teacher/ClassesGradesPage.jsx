// src/components/teacher/ClassesGradesPage.jsx
import { useState, useEffect } from 'react';
import Header from '../shared/Header';
import TeacherSidebar from '../shared/TeacherSidebar';
import { dataApi } from '../../api/data';

export default function ClassesGradesPage() {
    const [selectedClass, setSelectedClass] = useState('Wszyscy');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await dataApi.getAllStudents();
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch students", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div className="flex h-screen">
            <TeacherSidebar />
            <main className="flex-1 overflow-y-auto">
                <Header title="Klasy i Uczniowie" />
                <div className="p-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Wybierz klasę
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#D0BB95] focus:outline-none focus:ring-[#D0BB95] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            >
                                <option>Wszyscy</option>
                                {/* Add class fetching if needed, for now just show all */}
                            </select>
                        </div>

                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            Uczniowie
                        </h2>

                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D0BB95]"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Uczeń
                                            </th>
                                            <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Email
                                            </th>
                                            <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Klasy
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {students.map((student) => (
                                            <tr
                                                key={student.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {student.email}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {student.classes && student.classes.map(c => c.name).join(', ')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
