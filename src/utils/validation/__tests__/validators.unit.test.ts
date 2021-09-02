import { Validator } from 'class-validator';
import { IsUnique } from '../validators';

const validator = new Validator();

describe('IsUnique', () => {
  it('should return false for a null array', async () => {
    class MyClass {
      @IsUnique()
      arr: any[] = null!;
    }

    const model = new MyClass();
    const errors = await validator.validate(model);

    expect(errors.length).toBe(1);
    expect(errors[0].target).toBe(model);
    expect(errors[0].property).toBe('arr');
    expect(errors[0].constraints).toEqual({
      IsUnique: 'each value in the array must be unique',
    });
    expect(errors[0].value).toBeNull();
  });

  it('should return false for an undefined array', async () => {
    class MyClass {
      @IsUnique()
      arr!: any[];
    }

    const model = new MyClass();
    const errors = await validator.validate(model);

    expect(errors.length).toBe(1);
    expect(errors[0].target).toBe(model);
    expect(errors[0].property).toBe('arr');
    expect(errors[0].constraints).toEqual({
      IsUnique: 'each value in the array must be unique',
    });
    expect(errors[0].value).toBeUndefined();
  });

  it('should return true for an empty array', async () => {
    class MyClass {
      @IsUnique()
      arr: any[] = [];
    }

    const model = new MyClass();
    const errors = await validator.validate(model);

    expect(errors.length).toBe(0);
  });

  it('should return false for a non unique array', async () => {
    const arr = [1, 1];
    class MyClass {
      @IsUnique()
      arr: any[] = arr;
    }

    const model = new MyClass();
    const errors = await validator.validate(model);

    expect(errors.length).toBe(1);
    expect(errors[0].target).toBe(model);
    expect(errors[0].property).toBe('arr');
    expect(errors[0].constraints).toEqual({
      IsUnique: 'each value in the array must be unique',
    });
    expect(errors[0].value).toEqual(arr);
  });
});
