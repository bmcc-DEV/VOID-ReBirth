import { describe, it, expect } from 'vitest';
import { cpuMatrixMultiply, matrixMultiply } from './webgpu';

describe('WebGPU / CPU Tensor Operations', () => {
  it('should correctly multiply matrices on CPU fallback', () => {
    // 2x3 Matrix A
    const matrixA = new Float32Array([
      1, 2, 3,
      4, 5, 6
    ]);
    
    // 3x2 Matrix B
    const matrixB = new Float32Array([
      7, 8,
      9, 10,
      11, 12
    ]);

    // Expected 2x2 Matrix C:
    // [1*7 + 2*9 + 3*11,  1*8 + 2*10 + 3*12] -> [58, 64]
    // [4*7 + 5*9 + 6*11,  4*8 + 5*10 + 6*12] -> [139, 154]
    const expected = new Float32Array([
      58, 64,
      139, 154
    ]);

    const result = cpuMatrixMultiply(matrixA, matrixB, 2, 3, 2);
    expect(result).toEqual(expected);
  });

  it('should fall back to CPU when WebGPU is unavailable', async () => {
    // In node environment, navigator.gpu doesn't exist, which triggers CPU fallback
    const matrixA = new Float32Array([
      1, 2,
      3, 4
    ]);
    const matrixB = new Float32Array([
      5, 6,
      7, 8
    ]);
    
    const result = await matrixMultiply(matrixA, matrixB, 2, 2, 2);
    expect(result).toBeDefined();
    
    const expected = new Float32Array([
      19, 22,
      43, 50
    ]);
    expect(result).toEqual(expected);
  });
});
