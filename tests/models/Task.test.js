const { Task, TaskError, TaskValidationError } = require('../../src/models/Task');

describe('Task Model', () => {
    let warnSpy;

    beforeEach(() => {
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    describe('pembuatan', () => {
        test('membuat task dengan data valid dan nilai awal yang benar', () => {
            const task = new Task('  Belajar  ', ' catatan ', 'high');
            expect(task.title).toBe('Belajar');
            expect(task.description).toBe('catatan');
            expect(task.priority).toBe('high');
            expect(task.completed).toBe(false);
            expect(task.id).toBeTruthy();
            expect(task.createdAt).toBeInstanceOf(Date);
        });

        test('prioritas default adalah medium dan deskripsi default kosong', () => {
            const task = new Task('Judul');
            expect(task.priority).toBe('medium');
            expect(task.description).toBe('');
        });

        test.each([[''], ['   '], [null], [undefined], [123]])(
            'menolak judul tidak valid: %p',
            (title) => {
                expect(() => new Task(title)).toThrow(TaskValidationError);
            }
        );

        test('menolak deskripsi bukan string dan prioritas di luar daftar', () => {
            expect(() => new Task('A', 123)).toThrow(TaskValidationError);
            expect(() => new Task('A', '', 'super-penting')).toThrow(TaskValidationError);
        });

        test('setiap task punya id unik', () => {
            const ids = new Set(Array.from({ length: 50 }, () => new Task('A').id));
            expect(ids.size).toBe(50);
        });
    });

    describe('perubahan status', () => {
        test('markComplete dan markIncomplete', () => {
            const task = new Task('A');
            task.markComplete();
            expect(task.completed).toBe(true);
            task.markIncomplete();
            expect(task.completed).toBe(false);
        });

        test('mengulang perubahan status yang sama hanya memberi peringatan', () => {
            const task = new Task('A');
            task.markIncomplete();
            expect(warnSpy).toHaveBeenCalled();
            task.markComplete();
            task.markComplete();
            expect(task.completed).toBe(true);
        });
    });

    describe('pembaruan', () => {
        test('updateTitle memangkas spasi dan memperbarui updatedAt', () => {
            const task = new Task('A');
            const sebelum = task.updatedAt;
            task.updateTitle('  Baru ');
            expect(task.title).toBe('Baru');
            expect(task.updatedAt.getTime()).toBeGreaterThanOrEqual(sebelum.getTime());
        });

        test('updateTitle menolak judul kosong dan lebih dari 200 karakter', () => {
            const task = new Task('A');
            expect(() => task.updateTitle('')).toThrow(TaskValidationError);
            expect(() => task.updateTitle('x'.repeat(201))).toThrow(TaskValidationError);
            expect(task.title).toBe('A');
        });

        test('updateDescription menerima kosong dan menolak lebih dari 1000 karakter', () => {
            const task = new Task('A', 'isi');
            task.updateDescription('');
            expect(task.description).toBe('');
            expect(() => task.updateDescription('x'.repeat(1001))).toThrow(TaskValidationError);
            expect(() => task.updateDescription(42)).toThrow(TaskValidationError);
        });

        test('updatePriority hanya menerima prioritas yang valid', () => {
            const task = new Task('A');
            task.updatePriority('low');
            expect(task.priority).toBe('low');
            expect(() => task.updatePriority('asal')).toThrow(TaskValidationError);
        });
    });

    describe('serialisasi', () => {
        test('toJSON lalu fromJSON menghasilkan task yang sama', () => {
            const asli = new Task('Simpan', 'deskripsi', 'high');
            asli.markComplete();

            const salinan = Task.fromJSON(JSON.parse(JSON.stringify(asli.toJSON())));
            expect(salinan.id).toBe(asli.id);
            expect(salinan.title).toBe('Simpan');
            expect(salinan.priority).toBe('high');
            expect(salinan.completed).toBe(true);
            expect(salinan.createdAt.toISOString()).toBe(asli.createdAt.toISOString());
        });

        test('fromJSON menolak data tidak valid', () => {
            expect(() => Task.fromJSON(null)).toThrow(TaskValidationError);
            expect(() => Task.fromJSON({})).toThrow(TaskValidationError);
            expect(() => Task.fromJSON({ title: 'A', createdAt: 'bukan-tanggal' })).toThrow(TaskValidationError);
            expect(() => Task.fromJSON({ title: 'A', updatedAt: 'bukan-tanggal' })).toThrow(TaskValidationError);
        });
    });

    test('TaskValidationError adalah turunan TaskError', () => {
        const error = new TaskValidationError('x');
        expect(error).toBeInstanceOf(TaskError);
        expect(error).toBeInstanceOf(Error);
    });
});
