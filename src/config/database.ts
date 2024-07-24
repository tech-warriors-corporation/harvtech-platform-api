import { join } from 'path'
import { DataSource } from 'typeorm'

import 'reflect-metadata'

import { env } from '~config/env'
import { Mode } from '~enums/Mode'

const directory = join(__dirname, '..')
const isDev = Mode.DEV === env.mode

export const dataSource = new DataSource({
    type: 'postgres',
    host: env.database.host,
    port: env.database.port,
    database: env.database.name,
    username: env.database.username,
    password: env.database.password,
    entities: [`${directory}/entities/*.ts`],
    migrations: [`${directory}/migrations/*.ts`],
    synchronize: false,
    logging: false,
    ssl: isDev ? false : { rejectUnauthorized: false },
})

export const connect = async () => {
    if (!dataSource.isInitialized) await dataSource.initialize().catch(console.error)
}

export const disconnect = async () => {
    await dataSource.destroy()
}
