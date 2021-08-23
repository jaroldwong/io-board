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

const getItemsOpts = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: User,
      },
    },
  },
};

const postOpts = {
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
    // response: {
    //   201: User,
    // },
  },
};

function userRoutes(fastify, options, done) {
  fastify.get('/users', getItemsOpts, async (req, reply) => {
    const client = await fastify.pg.connect();
    const qs =
      'SELECT id, first_name, last_name, updated_at, location_id FROM users ORDER BY first_name ASC';
    const { rows } = await client.query(qs);
    client.release();
    return rows;
  });

  fastify.post('/users', async (req, reply) => {
    const client = await fastify.pg.connect();
    const { first_name, last_name } = req.body;
    const qs =
      'INSERT INTO users (first_name, last_name) VALUES ($1, $2) RETURNING *';
    const { rows } = await client.query(qs, [first_name, last_name]);
    return rows;
  });

  fastify.get('/users/:id', async (req, reply) => {
    const client = await fastify.pg.connect();
    const qs = 'SELECT * FROM users WHERE id=$1';
    const { rows } = await client.query(qs, [req.params.id]);
    client.release();
    return rows;
  });

  fastify.patch('/users/:id', async (req, reply) => {
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
