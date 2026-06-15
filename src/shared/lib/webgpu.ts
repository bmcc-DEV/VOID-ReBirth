// WGSL Compute Shader for parallel matrix multiplication
const TENSOR_MULTIPLY_SHADER = `
@group(0) @binding(0) var<storage, read>       matrixA: array<f32>;
@group(0) @binding(1) var<storage, read>       matrixB: array<f32>;
@group(0) @binding(2) var<storage, read_write> result:  array<f32>;
@group(0) @binding(3) var<uniform>             params:  array<u32, 4>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let rowsA = params[0];
    let colsA = params[1];
    let colsB = params[2];

    let row = gid.x;
    let col = gid.y;

    if (row >= rowsA || col >= colsB) {
        return;
    }

    var sum: f32 = 0.0;
    for (var k: u32 = 0u; k < colsA; k = k + 1u) {
        sum = sum + matrixA[row * colsA + k] * matrixB[k * colsB + col];
    }

    result[row * colsB + col] = sum;
}
`;

export interface WebGPUTensorDevice {
  device: GPUDevice;
  adapter: GPUAdapter;
}

export interface MatrixMultiplyResult {
  result: Float32Array;
  rows: number;
  cols: number;
  gpuTimeMs: number;
}

/**
 * Initializes WebGPU for tensor operations.
 * Returns null if WebGPU is not supported.
 */
export async function initWebGPUTensor(): Promise<WebGPUTensorDevice | null> {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
    return null;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return null;
    }

    const device = await adapter.requestDevice({
      requiredLimits: {
        maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
        maxComputeWorkgroupStorageSize: adapter.limits.maxComputeWorkgroupStorageSize,
      },
    });

    return { device, adapter };
  } catch (err) {
    console.warn('[WebGPU Tensor] Failed to initialize device:', err);
    return null;
  }
}

/**
 * Clean up GPU device resources.
 */
export function destroyWebGPUTensor(gpu: WebGPUTensorDevice): void {
  gpu.device.destroy();
}

/**
 * Multiplies two matrices via WebGPU.
 */
export async function gpuMatrixMultiply(
  gpu: WebGPUTensorDevice,
  matrixA: Float32Array,
  matrixB: Float32Array,
  rowsA: number,
  colsA: number,
  colsB: number
): Promise<MatrixMultiplyResult> {
  const { device } = gpu;
  const t0 = performance.now();

  const USAGE = {
    STORAGE: 0x80,
    COPY_DST: 0x01,
    COPY_SRC: 0x04,
    UNIFORM: 0x40,
    MAP_READ: 0x0008,
  };

  const shaderModule = device.createShaderModule({ code: TENSOR_MULTIPLY_SHADER });

  const pipeline = device.createComputePipeline({
    layout: 'auto',
    compute: { module: shaderModule, entryPoint: 'main' },
  });

  const bufferA = device.createBuffer({
    size: matrixA.byteLength,
    usage: USAGE.STORAGE | USAGE.COPY_DST,
  });

  const bufferB = device.createBuffer({
    size: matrixB.byteLength,
    usage: USAGE.STORAGE | USAGE.COPY_DST,
  });

  const resultSize = rowsA * colsB * 4;
  const bufferResult = device.createBuffer({
    size: resultSize,
    usage: USAGE.STORAGE | USAGE.COPY_SRC,
  });

  const params = new Uint32Array([rowsA, colsA, colsB, 0]);
  const bufferParams = device.createBuffer({
    size: params.byteLength,
    usage: USAGE.UNIFORM | USAGE.COPY_DST,
  });

  // Write inputs to GPU buffers
  device.queue.writeBuffer(bufferA, 0, matrixA);
  device.queue.writeBuffer(bufferB, 0, matrixB);
  device.queue.writeBuffer(bufferParams, 0, params);

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: bufferA } },
      { binding: 1, resource: { buffer: bufferB } },
      { binding: 2, resource: { buffer: bufferResult } },
      { binding: 3, resource: { buffer: bufferParams } },
    ],
  });

  const workgroupsX = Math.ceil(rowsA / 16);
  const workgroupsY = Math.ceil(colsB / 16);

  const commandEncoder = device.createCommandEncoder();
  const computePass = commandEncoder.beginComputePass();
  computePass.setPipeline(pipeline);
  computePass.setBindGroup(0, bindGroup);
  computePass.dispatchWorkgroups(workgroupsX, workgroupsY);
  computePass.end();

  const readBuffer = device.createBuffer({
    size: resultSize,
    usage: USAGE.MAP_READ | USAGE.COPY_DST,
  });
  commandEncoder.copyBufferToBuffer(bufferResult, 0, readBuffer, 0, resultSize);

  device.queue.submit([commandEncoder.finish()]);

  // Read the calculated matrix from GPU
  await readBuffer.mapAsync(0x0001); // MAP_MODE.READ
  const resultArray = new Float32Array(readBuffer.getMappedRange().slice(0));
  readBuffer.unmap();

  // Destroy buffers
  bufferA.destroy();
  bufferB.destroy();
  bufferResult.destroy();
  bufferParams.destroy();
  readBuffer.destroy();

  return {
    result: resultArray,
    rows: rowsA,
    cols: colsB,
    gpuTimeMs: performance.now() - t0,
  };
}

/**
 * Pure JavaScript CPU fallback multiplication logic.
 */
export function cpuMatrixMultiply(
  matrixA: Float32Array,
  matrixB: Float32Array,
  rowsA: number,
  colsA: number,
  colsB: number
): Float32Array {
  const result = new Float32Array(rowsA * colsB);
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += matrixA[i * colsA + k] * matrixB[k * colsB + j];
      }
      result[i * colsB + j] = sum;
    }
  }
  return result;
}

/**
 * High-level unified matrix multiplier: attempts WebGPU first, 
 * falling back transparently to CPU if WebGPU fails or is missing.
 */
export async function matrixMultiply(
  matrixA: Float32Array,
  matrixB: Float32Array,
  rowsA: number,
  colsA: number,
  colsB: number
): Promise<Float32Array> {
  const gpu = await initWebGPUTensor();
  if (gpu) {
    try {
      const res = await gpuMatrixMultiply(gpu, matrixA, matrixB, rowsA, colsA, colsB);
      destroyWebGPUTensor(gpu);
      return res.result;
    } catch (e) {
      console.warn('[WebGPU] Multiplication failed, falling back to CPU:', e);
    }
  }
  return cpuMatrixMultiply(matrixA, matrixB, rowsA, colsA, colsB);
}
