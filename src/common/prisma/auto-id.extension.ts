import { Prisma } from '@prisma/client';
import { generateId } from '../ids/generate-id';
import { ID_PREFIX_BY_MODEL, isModelWithPrefix } from '../ids/id-prefix';

export const autoIdExtension = Prisma.defineExtension({
  name: 'auto-id',
  query: {
    $allModels: {
      async create({ model, args, query }) {
        if (isModelWithPrefix(model)) {
          const data = args.data as Record<string, unknown>;
          if (data && data.id == null) {
            data.id = generateId(ID_PREFIX_BY_MODEL[model]);
          }
        }
        return query(args);
      },
      async createMany({ model, args, query }) {
        if (isModelWithPrefix(model) && Array.isArray(args.data)) {
          const prefix = ID_PREFIX_BY_MODEL[model];
          const next = (args.data as Record<string, unknown>[]).map((row) =>
            row.id == null ? { ...row, id: generateId(prefix) } : row,
          );
          (args as { data: unknown }).data = next;
        }
        return query(args);
      },
      async upsert({ model, args, query }) {
        if (isModelWithPrefix(model)) {
          const createData = args.create as Record<string, unknown>;
          if (createData && createData.id == null) {
            createData.id = generateId(ID_PREFIX_BY_MODEL[model]);
          }
        }
        return query(args);
      },
    },
  },
});
