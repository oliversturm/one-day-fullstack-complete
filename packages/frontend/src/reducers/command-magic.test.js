import Im from 'seamless-immutable';
import { generateExport } from './command-magic';
const assert = require('assert');

const exp = generateExport(
  {
    ONE: {
      command: 'doOne',
      aliases: ['altCommand'],
      create: oneArg => ({ oneValue: oneArg }),
      handle: (s, a) => s.set('oneState', a.payload.oneValue)
    },
    TWO: {
      command: 'doTwo'
    }
  },
  'mycreator'
);

it('exp has correct command functions', function() {
  assert(exp.doOne.type === 'ONE');
  assert.deepEqual(exp.doOne('test'), {
    type: 'ONE',
    payload: { oneValue: 'test' }
  });

  assert(exp.altCommand.type === 'ONE');
  assert.deepEqual(exp.altCommand('test'), {
    type: 'ONE',
    payload: { oneValue: 'test' }
  });

  assert(exp.doTwo.type === 'TWO');
  assert.deepEqual(exp.doTwo(), {
    type: 'TWO'
  });
});

it('the reducer creator works', function() {
  const rc = exp.mycreator;
  const r = rc(Im({ some: 'thing' }));
  const a = exp.doOne('test');
  const newState = r(undefined, a);
  assert.deepEqual(newState, { some: 'thing', oneState: 'test' });
});
