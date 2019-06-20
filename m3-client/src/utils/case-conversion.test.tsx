import 'react';
import { pascalCaseToSnakeCase } from './case-conversion';

it('pascalCaseToSnakeCase() converts string case', () => {
  expect(pascalCaseToSnakeCase('SuperHero')).toBe('super_hero');
  expect(pascalCaseToSnakeCase('SuperBMX')).toBe('super_bmx');
  expect(pascalCaseToSnakeCase('BKid')).toBe('bkid');
});
