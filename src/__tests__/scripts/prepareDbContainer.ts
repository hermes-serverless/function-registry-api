import execa from 'execa'
import path from 'path'

export default async () => {
  console.log('==== Prepare DB container ====')
  const res = execa.sync(path.join(__dirname, 'start.sh'), ['-m'])
  // console.log(res.stdout)
  // console.log(res.stderr)
}
