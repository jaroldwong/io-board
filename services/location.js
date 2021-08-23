const Location = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    building: { type: 'string' },
  },
};

const getLocationsSchema = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: Location,
      },
    },
  },
};

function locationRoutes(fastify, options, done) {
  fastify.get('/locations', getLocationsSchema, async (req, reply) => {
    const client = await fastify.pg.connect();
    const { rows } = await client.query('SELECT * FROM locations');
    client.release();
    return rows;
  });
  done();
}

module.exports = locationRoutes;
