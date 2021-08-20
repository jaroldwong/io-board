const user = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          location_id: { type: 'integer' },
          updated_at: { type: 'string' },
        },
      },
    },
  },
};

const location = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          building: { type: 'string' },
        },
      },
    },
  },
};

module.exports = {
  userSchema: {
    schema: user,
  },
  locationSchema: {
    schema: location,
  },
};
