import { SimplifiedUser } from './user'

export interface RunFunctionData {
  functionName: string
  functionVersion: string
  language: string
  gpuCapable: boolean
  scope: string
  imageName: string
  owner: { username: string }
}

export interface RunData {
  id: string
  functionId: string
  userId: string
  status: string
  startTime: Date | null
  endTime: Date | null
  watcherID: string | null
  function: RunFunctionData
}

interface RunGetObj {
  user: SimplifiedUser
  runs: RunData[]
}

interface RunDeleteObj {
  user: SimplifiedUser
  deletedRuns: RunData[]
}

interface RunPostObj {
  user: SimplifiedUser
  createdRun: RunData[]
}

interface RunPutObj {
  user: SimplifiedUser
  updatedRuns: RunData[]
}
