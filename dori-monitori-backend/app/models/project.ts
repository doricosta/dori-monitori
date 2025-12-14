import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare apiKey: string

  @column()
  declare createdBy: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare owner: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'user_projects',
    localKey: 'id',
    pivotForeignKey: 'project_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare members: ManyToMany<typeof User>
}
