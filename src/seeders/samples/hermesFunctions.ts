export interface FunctionData {
  functionName: string
  language: string
  gpuCapable: boolean
  scope: string
  imageUrl: string
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
      gpuCapable: true,
      scope: 'public',
      imageUrl: 'dockerhub.com.br',
      functionVersion: '1.0.0',
    },
  },
  {
    owner: 'tiago',
    data: {
      functionName: 'reduce-mult',
      language: 'cuda',
      gpuCapable: true,
      scope: 'public',
      imageUrl: 'dockerhub.com.br',
      functionVersion: '1.0.0',
    },
  },
]

export default seedFunctions
