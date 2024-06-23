import { join } from 'path'
import { DataSource } from 'typeorm'

import 'reflect-metadata'

import { env } from '~config/env'

const directory = join(__dirname, '..')

export const dataSource = new DataSource({
    type: 'postgres',
    host: env.database.host,
    port: env.database.port,
    database: env.database.name,
    username: env.database.username,
    password: env.database.password,
    entities: [`${directory}/entities/**/*.ts`],
    synchronize: true,
    logging: false,
})

export const connect = async () => {
    if (!dataSource.isInitialized) await dataSource.initialize().catch(console.error)
}

export const disconnect = async () => {
    await dataSource.destroy()
}

export const synchronize = async () => {
    await dataSource.synchronize(true)
}
