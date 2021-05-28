import express from 'express';
import authRoutes from './routes/auth.routes';
import centerRoutes from './routes/center.routes';

const PORT = process.env.PORT || 3030;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/center', centerRoutes);

app.listen(PORT, () => console.log(`Server ready at: ${PORT}`));
