export interface FunctionData {
  functionName: string
  language: string
  gpuCapable: boolean
  scope: string
  imageName: string
  functionVersion: string
}

export interface FunctionSeed {
  owner: string
  data: FunctionData
}

const seedFunctions: FunctionSeed[] = [
  {
    owner: 'tiago',
    data: {
      functionName: 'reduce-sum',
      language: 'cuda',
      gpuCapable: false,
      scope: 'public',
      imageName: 'tiago/reduce-sum:1.0.0',
      functionVersion: '1.0.0',
    },
  },
  {
    owner: 'tiago',
    data: {
      functionName: 'reduce-sum',
      language: 'cuda',
      gpuCapable: true,
      scope: 'public',
      imageName: 'tiago/reduce-sum:1.0.1',
      functionVersion: '1.0.1',
    },
  },
  {
    owner: 'tiago',
    data: {
      functionName: 'reduce-sum',
      language: 'cuda',
      gpuCapable: true,
      scope: 'public',
      imageName: 'tiago/reduce-sum:2.0.0',
      functionVersion: '2.0.0',
    },
  },
  {
    owner: 'tiago',
    data: {
      functionName: 'reduce-mult',
      language: 'cpp',
      gpuCapable: false,
      scope: 'public',
      imageName: 'tiago/reduce-mult:1.0.0',
      functionVersion: '1.0.0',
    },
  },
  {
    owner: 'tiago',
    data: {
      functionName: 'reduce-mult',
      language: 'cpp',
      gpuCapable: false,
      scope: 'public',
      imageName: 'tiago/reduce-mult:2.0.0',
      functionVersion: '2.0.0',
    },
  },
]

export default seedFunctions
