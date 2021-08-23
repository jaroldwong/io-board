const schema = require('../schemas/location.schema');

function locationRoutes(fastify, options, done) {
  fastify.get('/locations', schema.findAll, async (req, reply) => {
    const client = await fastify.pg.connect();
    const { rows } = await client.query('SELECT * FROM locations');
    client.release();
    return rows;
  });
  done();
}

module.exports = locationRoutes;
