import React, { useState } from 'react';
import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

interface Props extends SharedData {
    tasks: Task[];
    [key: string]: unknown;
}

export default function Welcome({ tasks }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) return;

        router.post(route('tasks.store'), {
            title: title.trim(),
            description: description.trim() || null,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setTitle('');
                setDescription('');
                setIsAddingTask(false);
            }
        });
    };

    const handleToggleComplete = (task: Task) => {
        router.patch(route('tasks.update', task.id), {
            title: task.title,
            description: task.description,
            completed: !task.completed,
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDeleteTask = (task: Task) => {
        router.delete(route('tasks.destroy', task.id), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);

    return (
        <>
            <Head title="Todo App" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
                <header className="bg-white shadow-sm dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Todo App</h1>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Add Task Form */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add New Task
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!isAddingTask ? (
                                <Button onClick={() => setIsAddingTask(true)} className="w-full">
                                    Add Task
                                </Button>
                            ) : (
                                <form onSubmit={handleAddTask} className="space-y-4">
                                    <div>
                                        <Input
                                            type="text"
                                            placeholder="Task title..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            placeholder="Task description (optional)..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={!title.trim()}>
                                            Add Task
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsAddingTask(false);
                                                setTitle('');
                                                setDescription('');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tasks Overview */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                                <p className="text-sm text-gray-600">Total Tasks</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-2xl font-bold text-orange-600">{pendingTasks.length}</div>
                                <p className="text-sm text-gray-600">Pending</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                                <p className="text-sm text-gray-600">Completed</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Task Lists */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Pending Tasks */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-orange-600">
                                    Pending Tasks ({pendingTasks.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pendingTasks.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">
                                        No pending tasks. Great job! 🎉
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {pendingTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-start gap-3 rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <Checkbox
                                                    checked={task.completed}
                                                    onCheckedChange={() => handleToggleComplete(task)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                                        {task.title}
                                                    </h3>
                                                    {task.description && (
                                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Created {new Date(task.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteTask(task)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Completed Tasks */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-600">
                                    Completed Tasks ({completedTasks.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {completedTasks.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">
                                        No completed tasks yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {completedTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-start gap-3 rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800 opacity-75"
                                            >
                                                <Checkbox
                                                    checked={task.completed}
                                                    onCheckedChange={() => handleToggleComplete(task)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 dark:text-white line-through">
                                                        {task.title}
                                                    </h3>
                                                    {task.description && (
                                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-through">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Completed {new Date(task.updated_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteTask(task)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {tasks.length === 0 && (
                        <Card className="mt-8">
                            <CardContent className="p-12 text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Welcome to Your Todo App!
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Get started by adding your first task above. You can add a title and optional description.
                                </p>
                                <Button onClick={() => setIsAddingTask(true)}>
                                    Add Your First Task
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </>
    );
}