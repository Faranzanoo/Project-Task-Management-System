// TaskService memakai kelas Task sebagai variabel global (gaya script browser)
const { Task } = require('../../src/models/Task');
global.Task = Task;
const TaskService = require('../../src/services/TaskService');
const StorageManager = require('../../src/utils/StorageManager');

describe('TaskService', () => {
    let service;
    let storage;

    beforeEach(() => {
        localStorage.clear();
        storage = new StorageManager('serviceTest');
        service = new TaskService(storage);
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    test('membuat task dan menyimpannya', () => {
        const task = service.createTask('Belajar Jest', 'Tulis tes', 'high');
        expect(task.title).toBe('Belajar Jest');
        expect(service.getAllTasks()).toHaveLength(1);
        expect(service.getTaskById(task.id)).toBe(task);
    });

    test('menolak task tanpa judul', () => {
        expect(() => service.createTask('', 'x', 'low')).toThrow();
        expect(service.getAllTasks()).toHaveLength(0);
    });

    test('memuat ulang task dari storage', () => {
        service.createTask('Persisten', '', 'medium');
        const serviceBaru = new TaskService(storage);
        expect(serviceBaru.getAllTasks().map(t => t.title)).toEqual(['Persisten']);
    });

    test('memperbarui judul, prioritas, dan status', () => {
        const task = service.createTask('Lama', '', 'low');
        service.updateTask(task.id, { title: 'Baru', priority: 'high', completed: true });
        expect(task.title).toBe('Baru');
        expect(task.priority).toBe('high');
        expect(task.completed).toBe(true);

        service.updateTask(task.id, { completed: false });
        expect(task.completed).toBe(false);
    });

    test('update id yang tidak ada mengembalikan null', () => {
        expect(service.updateTask('tidak-ada', { title: 'x' })).toBeNull();
    });

    test('menghapus task', () => {
        const task = service.createTask('Hapus aku', '', 'low');
        expect(service.deleteTask(task.id)).toBe(true);
        expect(service.deleteTask(task.id)).toBe(false);
        expect(service.getAllTasks()).toHaveLength(0);
    });

    test('memfilter berdasarkan status dan prioritas', () => {
        const a = service.createTask('A', '', 'high');
        service.createTask('B', '', 'low');
        service.updateTask(a.id, { completed: true });

        expect(service.getTasksByStatus(true)).toHaveLength(1);
        expect(service.getTasksByStatus(false)).toHaveLength(1);
        expect(service.getTasksByPriority('high').map(t => t.title)).toEqual(['A']);
    });

    test('menghitung statistik', () => {
        const a = service.createTask('A', '', 'high');
        service.createTask('B', '', 'medium');
        service.createTask('C', '', 'low');
        service.updateTask(a.id, { completed: true });

        expect(service.getTaskStats()).toEqual({
            total: 3,
            completed: 1,
            pending: 2,
            byPriority: { high: 1, medium: 1, low: 1 }
        });
    });

    test('listener menerima event dan error di listener tidak menggagalkan operasi', () => {
        const events = [];
        service.addListener((type) => events.push(type));
        service.addListener(() => { throw new Error('listener rusak'); });

        const task = service.createTask('Event', '', 'low');
        service.updateTask(task.id, { title: 'Event 2' });
        service.deleteTask(task.id);

        expect(events).toEqual(['taskCreated', 'taskUpdated', 'taskDeleted']);
    });

    test('removeListener dan clearAllTasks', () => {
        const listener = jest.fn();
        service.addListener(listener);
        service.removeListener(listener);

        service.createTask('A', '', 'low');
        expect(listener).not.toHaveBeenCalled();

        expect(service.clearAllTasks()).toBe(true);
        expect(service.getAllTasks()).toHaveLength(0);
    });
});
