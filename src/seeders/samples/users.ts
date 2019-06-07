export interface UserSeed {
  username: string
  password: string
}

const seedUsers: UserSeed[] = [
  {
    username: 'tiago',
    password: '123',
  },
  {
    username: 'ermenegildo',
    password: '123',
  },
]

export default seedUsers
