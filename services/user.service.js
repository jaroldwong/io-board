const schema = require('../schemas/user.schema');

function userRoutes(fastify, options, done) {
  fastify.get('/users', schema.findAll, async (req, reply) => {
    const client = await fastify.pg.connect();
    const qs =
      'SELECT id, first_name, last_name, updated_at, location_id FROM users ORDER BY first_name ASC';
    const { rows } = await client.query(qs);
    client.release();
    return rows;
  });

  fastify.post('/users', schema.insertOne, async (req, reply) => {
    const client = await fastify.pg.connect();
    const { first_name, last_name } = req.body;
    const qs =
      'INSERT INTO users (first_name, last_name) VALUES ($1, $2) RETURNING *';
    const { rows } = await client.query(qs, [first_name, last_name]);
    return rows;
  });

  fastify.get('/users/:id', schema.findOne, async (req, reply) => {
    const client = await fastify.pg.connect();
    const qs = 'SELECT * FROM users WHERE id=$1';
    const { rows } = await client.query(qs, [req.params.id]);
    client.release();
    return rows;
  });

  fastify.patch('/users/:id', schema.updateOne, async (req, reply) => {
    const id = req.params.id;
    const { location_id } = req.body;
    const client = await fastify.pg.connect();
    const qs = 'UPDATE users SET location_id=$1 WHERE id=$2';
    const result = await client.query(qs, [location_id, id]);
    client.release();
    return result;
  });

  done();
}

module.exports = userRoutes;
