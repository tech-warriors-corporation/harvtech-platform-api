import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class AccountEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string = ''

    @Column()
    name: string = ''

    @Column({ unique: true })
    email: string = ''

    @Column()
    password: string = ''

    @Column({ type: 'int' }) // TODO: create enum for type
    type: number = 0
}
