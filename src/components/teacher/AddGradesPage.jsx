// src/components/teacher/AddGradesPage.jsx
import { useState, useEffect } from 'react';
import Header from '../shared/Header';
import TeacherSidebar from '../shared/TeacherSidebar';
import { dataApi } from '../../api/data';
import { subjectsApi } from '../../api/subjects';
import { gradesApi } from '../../api/grades';

export default function AddGradesPage() {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newGradeValue, setNewGradeValue] = useState('');
    const [gradeType, setGradeType] = useState('sprawdzian');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsRes, subjectsRes] = await Promise.all([
                dataApi.getAllStudents(),
                subjectsApi.getAll()
            ]);
            setStudents(studentsRes.data);
            setSubjects(subjectsRes.data);
            if (subjectsRes.data.length > 0) {
                setSelectedSubjectId(subjectsRes.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openAddGradeModal = (student) => {
        setSelectedStudent(student);
        setNewGradeValue('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedStudent(null);
    };

    const handleAddGrade = async () => {
        if (!newGradeValue || !selectedSubjectId || !selectedStudent) return;

        try {
            await gradesApi.add({
                student_id: selectedStudent.id,
                subject_id: selectedSubjectId,
                value: parseFloat(newGradeValue),
                type: gradeType
            });
            await fetchData(); // Refresh data
            closeModal();
        } catch (error) {
            console.error("Failed to add grade", error);
            alert("Nie udało się dodać oceny.");
        }
    };

    const getAverageGrade = (student) => {
        if (!student.grades || student.grades.length === 0) return 0;
        // Filter grades by selected subject
        const subjectGrades = student.grades.filter(g => g.subject_id === parseInt(selectedSubjectId));
        if (subjectGrades.length === 0) return 0;

        const sum = subjectGrades.reduce((a, b) => a + parseFloat(b.value), 0);
        return sum / subjectGrades.length;
    };

    return (
        <div className="flex h-screen">
            <TeacherSidebar />
            <main className="flex-1 overflow-y-auto">
                <Header title="Dodaj Oceny" />
                <div className="p-8">
                    <div className="mx-auto max-w-5xl">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D0BB95]"></div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Wybierz przedmiot
                                        </label>
                                        <select
                                            value={selectedSubjectId}
                                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#D0BB95] focus:outline-none focus:ring-[#D0BB95] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        >
                                            {subjects.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Oceny studentów
                                    </h2>
                                    <div className="relative w-full sm:w-auto">
                                        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            search
                                        </span>
                                        <input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-[#D0BB95] focus:ring-[#D0BB95] dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:w-64"
                                            placeholder="Szukaj ucznia..."
                                            type="search"
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Uczeń
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Oceny (z przedmiotu)
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Średnia
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Akcje
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/50">
                                            {filteredStudents.map((student) => {
                                                const avg = getAverageGrade(student);
                                                const subjectGrades = student.grades ? student.grades.filter(g => g.subject_id === parseInt(selectedSubjectId)) : [];

                                                return (
                                                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                            {student.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                            {subjectGrades.map(g => g.value).join(', ')}
                                                        </td>
                                                        <td
                                                            className={`whitespace-nowrap px-6 py-4 text-sm font-semibold ${avg < 3 && avg > 0
                                                                ? 'text-red-500 dark:text-red-400'
                                                                : 'text-gray-900 dark:text-white'
                                                                }`}
                                                        >
                                                            {avg > 0 ? avg.toFixed(2) : '-'}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => openAddGradeModal(student)}
                                                                className="text-[#D0BB95] hover:text-[#c9ad86]"
                                                            >
                                                                Dodaj ocenę
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Add Grade Modal */}
                {showModal && selectedStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                            <div className="flex items-start justify-between">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dodaj ocenę</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Uczeń: {selectedStudent.name}
                            </p>
                            <div className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ocena
                                    </label>
                                    <select
                                        value={newGradeValue}
                                        onChange={(e) => setNewGradeValue(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-[#D0BB95] focus:ring-[#D0BB95] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Wybierz ocenę</option>
                                        <option value="6">6</option>
                                        <option value="5">5</option>
                                        <option value="4">4</option>
                                        <option value="3">3</option>
                                        <option value="2">2</option>
                                        <option value="1">1</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Typ
                                    </label>
                                    <select
                                        value={gradeType}
                                        onChange={(e) => setGradeType(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-[#D0BB95] focus:ring-[#D0BB95] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="sprawdzian">Sprawdzian</option>
                                        <option value="kartkówka">Kartkówka</option>
                                        <option value="odpowiedź">Odpowiedź</option>
                                        <option value="aktywność">Aktywność</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    onClick={handleAddGrade}
                                    disabled={!newGradeValue}
                                    className="w-full rounded-lg border border-transparent bg-[#D0BB95] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#c9ad86] focus:outline-none focus:ring-2 focus:ring-[#D0BB95] focus:ring-offset-2 dark:focus:ring-offset-[#1d1a15] sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Zapisz
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
