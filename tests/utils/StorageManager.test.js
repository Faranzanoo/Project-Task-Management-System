const StorageManager = require('../../src/utils/StorageManager');

describe('StorageManager', () => {
    let storage;

    beforeEach(() => {
        localStorage.clear();
        storage = new StorageManager('testApp');
    });

    test('menyimpan dan memuat data', () => {
        expect(storage.save('tasks', [{ id: 1 }])).toBe(true);
        expect(storage.load('tasks')).toEqual([{ id: 1 }]);
    });

    test('mengembalikan nilai default jika kunci tidak ada', () => {
        expect(storage.load('tidak-ada')).toBeNull();
        expect(storage.load('tidak-ada', [])).toEqual([]);
    });

    test('mengembalikan nilai default jika data rusak (bukan JSON)', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.setItem('testApp_rusak', '{bukan json');
        expect(storage.load('rusak', 'default')).toBe('default');
        errorSpy.mockRestore();
    });

    test('menghapus satu kunci', () => {
        storage.save('a', 1);
        expect(storage.remove('a')).toBe(true);
        expect(storage.load('a')).toBeNull();
    });

    test('clear hanya menghapus data milik aplikasi ini', () => {
        storage.save('a', 1);
        localStorage.setItem('aplikasiLain_x', '1');
        expect(storage.clear()).toBe(true);
        expect(storage.load('a')).toBeNull();
        expect(localStorage.getItem('aplikasiLain_x')).toBe('1');
    });

    test('getStorageInfo melaporkan ukuran data aplikasi', () => {
        storage.save('a', 'halo');
        const info = storage.getStorageInfo();
        expect(info.available).toBe(true);
        expect(info.appSize).toBeGreaterThan(0);
        expect(info.itemCount).toBe(1);
    });

    test('tidak gagal ketika localStorage tidak tersedia', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        storage.isAvailable = false;
        expect(storage.save('a', 1)).toBe(false);
        expect(storage.load('a', 'x')).toBe('x');
        expect(storage.remove('a')).toBe(false);
        expect(storage.clear()).toBe(false);
        expect(storage.getStorageInfo()).toEqual({ available: false });
        warnSpy.mockRestore();
    });
});
