import Fastify from 'fastify';

import { users } from './users';

const fastify = Fastify({
  logger: true,
});
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

fastify.post('/uppercase', (request, reply) => {
  const body = request.body.toUpperCase();
  if (body.includes('FUCK')) {
    return reply.status(403).send('unresolved');
  } else {
    return reply.send(body);
  }
});

fastify.post('/lowercase', (request, reply) => {
  const body = request.body.toLowerCase();
  if (body.includes('fuck')) {
    return reply.status(403).send('unresolved');
  } else {
    return reply.send(body);
  }
});

fastify.get('/user/:id', (request, reply) => {
  const id = request.params.id;
  if (users[id]) {
    return reply.send(users[id]);
  } else {
    reply.status(400).send('User not exist');
  }
});

fastify.get('/users', (request, reply) => {
  const usersArray = Object.values(users);
  let { filter, value } = request.query;
  if(!filter || !value) {
    return reply.send(usersArray);
  }
  else {
    const filteredUsers = usersArray.filter((user) => {
      return user[filter].toString() === value;
  });
    return reply.send(filteredUsers);
  }
});

export default fastify;
