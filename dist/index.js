import * as db from './queries.js';
import { port } from './config.js';
import express from 'express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' });
});
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
app.post('/login', db.login);
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map