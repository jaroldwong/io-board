const Location = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    building: { type: 'string' },
  },
};

const findAll = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: Location,
      },
    },
  },
};

module.exports = {
  findAll,
};
