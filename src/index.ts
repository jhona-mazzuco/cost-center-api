import express from 'express';
import authRoutes from './routes/auth.routes';

const PORT = process.env.PORT || 3030;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server ready at: ${PORT}`));
