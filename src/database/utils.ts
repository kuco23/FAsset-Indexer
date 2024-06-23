import { MikroORM } from "@mikro-orm/core"
import { Var } from "./entities/state/var"
import { ORM_OPTIONS } from "./mikro-orm.config"
import type { EntityManager } from "@mikro-orm/knex"
import type { ORM, OrmOptions, SchemaUpdate } from "./interface"


export async function createOrm(options: OrmOptions, update: SchemaUpdate): Promise<ORM> {
  const initOptions = { ...ORM_OPTIONS, ...options }
  const orm = await MikroORM.init(initOptions)
  await updateSchema(orm, update)
  if (!await orm.isConnected())
    throw new Error("Failed to connect to database")
  return orm
}

export async function updateSchema(orm: ORM, update: SchemaUpdate = "full"): Promise<void> {
  if (update === "none") return;
  const generator = orm.getSchemaGenerator();
  if (update && update == "recreate") {
    await generator.dropSchema();
    await generator.updateSchema();
  } else {
    await generator.updateSchema({ safe: update === "safe" });
  }
}

export async function setVar(em: EntityManager, key: string, value?: string): Promise<void> {
  const lastUpdate = Date.now()
  let vr = await em.findOne(Var, { key })
  if (!vr) {
    let vr = new Var(key, value, lastUpdate)
    em.persist(vr)
  } else {
    vr.value = value
    vr.lastUpdate = lastUpdate
  }
  await em.flush()
}

export async function getVar(em: EntityManager, key: string): Promise<Var | null> {
  return await em.findOne(Var, { key })
}