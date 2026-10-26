const EnhancedStorageManager = require('../../src/utils/EnhancedStorageManager');

describe('EnhancedStorageManager', () => {
    let storage;

    beforeEach(() => {
        localStorage.clear();
        storage = new EnhancedStorageManager('testApp', '2.0');
    });

    test('menyimpan entitas dengan versi dan timestamp', () => {
        expect(storage.save('users', [{ name: 'a' }])).toBe(true);
        const raw = JSON.parse(localStorage.getItem('testApp_users'));
        expect(raw.data).toEqual([{ name: 'a' }]);
        expect(raw.version).toBe('2.0');
        expect(typeof raw.timestamp).toBe('string');
    });

    test('memuat data dan memakai default jika tidak ada', () => {
        storage.save('tasks', [1, 2, 3]);
        expect(storage.load('tasks')).toEqual([1, 2, 3]);
        expect(storage.load('kosong', [])).toEqual([]);
    });

    test('exists dan getEntities mengenali entitas yang tersimpan', () => {
        storage.save('users', []);
        storage.save('tasks', []);
        expect(storage.exists('users')).toBe(true);
        expect(storage.exists('lain')).toBe(false);
        expect(storage.getEntities().sort()).toEqual(['tasks', 'users']);
    });

    test('metadata mencatat entitas yang disimpan lalu menghapusnya saat remove', () => {
        storage.save('tasks', []);
        expect(Object.keys(storage.getMetadata().entities)).toContain('tasks');
        storage.remove('tasks');
        expect(storage.exists('tasks')).toBe(false);
        expect(Object.keys(storage.getMetadata().entities)).not.toContain('tasks');
    });

    test('export lalu import memulihkan data', () => {
        storage.save('tasks', [{ id: 'a' }]);
        const backup = storage.exportData();
        expect(backup.appName).toBe('testApp');

        storage.clear();
        expect(storage.load('tasks')).toBeNull();

        expect(storage.importData(backup)).toBe(true);
        expect(storage.load('tasks')).toEqual([{ id: 'a' }]);
    });

    test('import menolak format yang tidak valid', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(storage.importData({})).toBe(false);
        errorSpy.mockRestore();
    });

    test('clear tidak menyentuh data aplikasi lain', () => {
        storage.save('tasks', []);
        localStorage.setItem('lain_x', '1');
        storage.clear();
        expect(localStorage.getItem('lain_x')).toBe('1');
    });

    test('getStorageInfo melaporkan jumlah key milik aplikasi', () => {
        storage.save('tasks', []);
        const info = storage.getStorageInfo();
        expect(info.available).toBe(true);
        expect(info.appKeys).toBeGreaterThan(0);
    });
});
