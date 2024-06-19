import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { AccountType } from '~enums/AccountType'
import { DEFAULT_MAX_LENGTH } from '~utils/validations'

@Entity()
export class AccountEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string = ''

    @Column({ type: 'varchar', length: DEFAULT_MAX_LENGTH })
    name: string = ''

    @Column({ type: 'varchar', length: DEFAULT_MAX_LENGTH, unique: true })
    email: string = ''

    @Column({ type: 'varchar', length: DEFAULT_MAX_LENGTH })
    password: string = ''

    @Column({ type: 'enum', enum: AccountType })
    type: AccountType = AccountType.ADMIN

    @ManyToOne(() => AccountEntity, { nullable: true }) // TODO: maybe use other relationship
    @JoinColumn({ name: 'parentId' })
    parent?: AccountEntity
}
