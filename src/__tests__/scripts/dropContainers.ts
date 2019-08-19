import execa from 'execa'
import path from 'path'

export default async () => {
  console.log('==== Drop DB container ====')
  const res = execa.sync(path.join(__dirname, 'stop.sh'))
  console.log(res.stdout)
  console.log(res.stderr)
}
