const notifyChangeCommand = cmdName => ({
  command: cmdName,
  create: changeInfo => ({ changeInfo }),
  handle: (s, { payload: { changeInfo } }) => {
    switch (changeInfo.changeKind) {
      case 'addRow':
        return s.set('data', (s.data || []).concat([changeInfo.details]));
      case 'updateRow': {
        if (!s.data) return s;
        const index = s.data.findIndex(i => i.id === changeInfo.details.id);
        return index >= 0
          ? s.setIn(['data', index], s.data[index].merge(changeInfo.details))
          : s;
      }
      case 'deleteRow':
        if (!s.data) return s;
        return s.set(
          'data',
          s.data.filter(i => i.id !== changeInfo.details.id)
        );
      case 'all':
        return s.set('loadRequired', Date.now());
      default:
        return s;
    }
  }
});

module.exports = notifyChangeCommand;
