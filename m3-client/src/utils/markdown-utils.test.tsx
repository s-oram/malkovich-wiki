import 'react';
import MarkdownUtils from './markdown-utils';

it('Parses wiki links in various formats', () => {
  let input;
  let test;
  let output;

  input = '[[pizza|eggs]]';
  test = '[eggs](/pizza)';
  output = MarkdownUtils.convertWikiLinks(input);
  expect(output).toBe(test);

  input = '[[pizza]]';
  test = '[pizza](/pizza)';
  output = MarkdownUtils.convertWikiLinks(input);
  expect(output).toBe(test);

  input = '[[PizzaRecipe|a long display name]]';
  test = '[a long display name](/PizzaRecipe)';
  output = MarkdownUtils.convertWikiLinks(input);
  expect(output).toBe(test);

  input = '[[Best pizza NAME]]';
  test = '[Best pizza NAME](/Best_pizza_NAME)';
  output = MarkdownUtils.convertWikiLinks(input);
  expect(output).toBe(test);
});

it('Parses wiki links in multiline text', () => {
  let input;
  let test;
  let output;

  input = `three [[pigs]] went to the market
three [[pizzas]] came home`;

  test = `three [pigs](/pigs) went to the market
three [pizzas](/pizzas) came home`;

  output = MarkdownUtils.convertWikiLinks(input);
  expect(output).toBe(test);
});


