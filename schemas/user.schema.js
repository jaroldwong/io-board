const User = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    location_id: { type: 'integer' },
    updated_at: { type: 'string' },
  },
};

const findAll = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: User,
      },
    },
  },
};

const findOne = {
  schema: {
    response: {
      200: User,
    },
  },
};

const insertOne = {
  schema: {
    body: {
      type: 'object',
      required: ['first_name', 'last_name'],
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
      },
    },
  },
};

const updateOne = {
  schema: {
    body: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'integer',
        },
      },
    },
    response: {
      200: User,
    },
  },
};

module.exports = {
  findAll,
  findOne,
  insertOne,
  updateOne,
};
