import execa from 'execa'
import path from 'path'

export const clearDatabase = () => {
  const db = require('../db')
  return Promise.all([
    db.HermesFunction.destroy({ where: {} }),
    db.Run.destroy({ where: {} }),
    db.User.destroy({ where: {} }),
  ])
}

export const startupPostgresContainer = async (containerName: string, port: number) => {
  const args = ['-m', '-p', port.toString(), '-n', containerName]
  return execa(path.join(__dirname, 'scripts', 'start.sh'), args)
}

export const stopPostgresContainer = async (containerName: string) => {
  return execa(path.join(__dirname, 'scripts', 'stop.sh'), ['-n', containerName])
}

export const mockSequelizePort = (port: number) => {
  jest.doMock('../db/config/config.js', () => {
    const actual = jest.requireActual('../db/config/config.js')
    return {
      test: {
        ...actual.test,
        port: port.toString(),
      },
    }
  })
}
