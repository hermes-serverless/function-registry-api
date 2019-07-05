export interface RunData {
  startTime: Date
  status: string
  endTime?: Date
  watcherId?: string
}

export interface RunSeed {
  username: string
  functionData: { functionOwner: string; functionName: string; functionVersion: string }
  data: RunData
}

const seedRuns: RunSeed[] = [
  {
    username: 'ermenegildo',
    functionData: {
      functionOwner: 'tiago',
      functionName: 'reduce-sum',
      functionVersion: '1.0.0',
    },
    data: {
      startTime: new Date(),
      status: 'success',
      endTime: new Date(),
    },
  },
  {
    username: 'ermenegildo',
    functionData: {
      functionOwner: 'tiago',
      functionName: 'reduce-mult',
      functionVersion: '1.0.0',
    },
    data: {
      startTime: new Date(),
      status: 'success',
      endTime: new Date(),
    },
  },
  {
    username: 'ermenegildo',
    functionData: {
      functionOwner: 'tiago',
      functionName: 'reduce-sum',
      functionVersion: '1.0.0',
    },
    data: {
      startTime: new Date(),
      status: 'success',
    },
  },
]

export default seedRuns
