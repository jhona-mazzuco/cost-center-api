import express from 'express';
import routes from './routes/api.routes';

const PORT = process.env.PORT || 3030;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(PORT, () => console.log(`Server ready at: ${PORT}`));
