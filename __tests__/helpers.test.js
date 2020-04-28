// Copyright jacobtyq <jacobtyq@gmail.com> 2020. All Rights Reserved.
// Node module: helpers
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Helpers from "../src/Helpers/helpers";

test('Comparing strings to check that they match', () => {
  let valueA, valueB, valueC;
  valueA = 'good'
  valueB = 'good'
  valueC = 'bad'
  expect(Helpers.compareString(valueA,valueB)).toBeTruthy();
  expect(Helpers.compareString(valueA,valueC)).toBeFalsy();
  });

test('Check that the first letter of each word is capitalized', () => {
  expect(Helpers.capitalizeFirstLetter('teh peng is delicious')).toBe('Teh Peng Is Delicious');
  });