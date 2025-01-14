import { assert } from './utils';
import { ERRORS, REMOVED_ERRORS } from './error';

const header = `---
title: Federation error codes
sidebar_title: Error codes
---

When Apollo Gateway attempts to **compose** the schemas provided by your [subgraphs](./subgraphs/) into a **supergraph schema**, it confirms that:

* The subgraphs are valid
* The resulting supergraph schema is valid
* The gateway has all of the information it needs to execute operations against the resulting schema

If Apollo Gateway encounters an error, composition fails. This document lists subgraph validation and composition error codes, along with their root causes.
`;

function makeMarkdownArray(
  headers: string[],
  rows: string[][]
): string {
  const columns = headers.length;
  let out = '| ' + headers.join(' | ') + ' |\n';
  out += '|' + headers.map(_ => '---').join('|') + '|\n';
  for (const row of rows) {
    assert(row.length <= columns, `Row [${row}] has too columns (expect ${columns} but got ${row.length})`);
    const frow = row.length === columns
      ? row
      : row.concat(new Array<string>(columns - row.length).fill(''));
    out += '| ' + frow.join(' | ') + ' |\n'
  }
  return out;
}

const rows = Object.values(ERRORS).map(def => [
  '`' + def.code + '`',
  def.description,
  def.metadata.addedIn,
  def.metadata.replaces ? `Replaces: ${def.metadata.replaces.map(c => '`' + c + '`').join(', ')}` : ''
]);

const sortRowsByCode = (r1: string[], r2: string[]) => r1[0].localeCompare(r2[0]);

rows.sort(sortRowsByCode);

const errorsSection = `## Errors

The following errors might be raised during composition:

<div class="sticky-table">

${makeMarkdownArray(
  [ 'Code', 'Description', 'Since', 'Comment' ],
  rows
)}
</div>`;

const removedErrors = REMOVED_ERRORS
  .map(([code, comment]) => ['`' + code + '`', comment])
  .sort(sortRowsByCode);

const removedSection = `## Removed codes

The following error codes have been removed and are no longer generated by the most recent version of the \`@apollo/gateway\` library:

<div class="sticky-table">

${makeMarkdownArray(['Removed Code', 'Comment'], removedErrors)}
</div>`;

console.log(
  header + '\n\n'
  + errorsSection + '\n\n'
  + removedSection
);
