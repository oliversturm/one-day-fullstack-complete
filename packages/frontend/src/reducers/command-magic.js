import Im from 'seamless-immutable';
import _ from 'lodash/fp';

const generateCommand = (commandType, commandInfo) => {
  const creator = _.compose(
    pl => (pl ? { type: commandType, payload: pl } : { type: commandType }),
    commandInfo.create || (() => undefined)
  );
  creator.type = commandType;
  return creator;
};

const generateAliases = (commandType, map) =>
  map[commandType].aliases && map[commandType].aliases.length
    ? map[commandType].aliases.reduce(
        (r, v) => ({
          ...r,
          [v]: generateCommand(commandType, map[commandType])
        }),
        {}
      )
    : {};

const generateCommands = map =>
  Object.keys(map).reduce(
    (r, v) => ({
      ...r,
      [map[v].command]: generateCommand(v, map[v]),
      ...generateAliases(v, map)
    }),
    {}
  );

const handle = (commandInfo, state, action) =>
  commandInfo
    ? commandInfo.handle
      ? commandInfo.handle(state, action)
      : state
    : state;

const reducerCreatorCreator = map => (initialState = Im({})) => (
  state = initialState,
  action = {}
) => handle(map[action.type], state, action);

const generateExport = (map, reducerCreatorName) => ({
  ...generateCommands(map),
  [reducerCreatorName]: reducerCreatorCreator(map)
});

export { generateExport };
