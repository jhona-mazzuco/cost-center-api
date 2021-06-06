import express from 'express';
import authRoutes from './auth.routes';
import centerRoutes from './center.routes';
import costRoutes from './cost.routes';

const app = express();

app.use('/auth', authRoutes);
app.use('/centers', centerRoutes);
app.use('/costs', costRoutes);

export default app;
