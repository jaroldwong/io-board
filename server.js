require('dotenv').config();
const fastify = require('fastify')({ logger: true });

const userSchema = require('./schemas').userSchema;
const locationSchema = require('./schemas').locationSchema;

fastify.register(require('fastify-postgres'), {
  connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`,
});

fastify.get('/', async (request, reply) => {
  return { status: 'ok' };
});

fastify.get('/locations', locationSchema, async (req, reply) => {
  const client = await fastify.pg.connect();
  const { rows } = await client.query('SELECT * FROM locations');
  client.release();
  return rows;
});

fastify.get('/users', userSchema, async (req, reply) => {
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

const start = async () => {
  try {
    await fastify.listen(8080);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
