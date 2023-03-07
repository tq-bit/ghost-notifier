import Ajv from 'ajv';
import { Static, Type } from '@sinclair/typebox';

export const GhostArticle = Type.Object({
  id: Type.String(),
  title: Type.String(),
  visibility: Type.String(),
  updated_at: Type.String(),
  url: Type.Optional(Type.String()),
});

export const GhostWebhook = Type.Object({
  post: Type.Object({
    current: GhostArticle,
    previous: Type.Optional(Type.Any()),
  }),
});

export type GhostArticle = Static<typeof GhostArticle>;
export type GhostWebhook = Static<typeof GhostWebhook>;

/**
 * Validation methods for Type Compiler
 */

const ajv = new Ajv();

export function validateGhostWebhook(data: GhostWebhook) {
  const validator = ajv.compile(GhostWebhook);
  const result = validator(data);
  return { result, errors: validator.errors };
}
