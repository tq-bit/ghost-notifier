import Ajv from 'ajv';
import { Static, Type } from '@sinclair/typebox';

export enum DomainType {
  Public = 'public',
  Private = 'private',
}

export enum DomainStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export const DomainForm = Type.Object({
  name: Type.String(),
  type: Type.Enum(DomainType),
  status: Type.Enum(DomainStatus),
});

export const OwnedDomain = Type.Object({
  id: Type.String(),
  name: Type.String(),
  type: Type.Enum(DomainType),
  status: Type.Enum(DomainStatus),
  owner: Type.String(),
  key: Type.String(),
});

export type DomainForm = Static<typeof DomainForm>;
export type OwnedDomain = Static<typeof OwnedDomain>;

const ajv = new Ajv();

export function validateDomainForm(data: DomainForm) {
  const validator = ajv.compile(DomainForm);
  const result = validator(data);
  return { result, errors: validator.errors };
}

export function validateOwnedDomain(data: OwnedDomain) {
  const validator = ajv.compile(OwnedDomain);
  const result = validator(data);
  return { result, errors: validator.errors };
}
