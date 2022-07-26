import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import ip from 'ip';
import Response from './helpers/response.js';
import HttpStatus from './helpers/video.controller.js';
import videoRoutes from './helpers/video.route.js';
import logger from './helpers/logger.js';
import fs from 'fs';

export let results1;

dotenv.config();

const PORT = process.env.SERVER_LISTEN_PORT || 3000;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

export let searchFilters;
fs.readFile('./init-files/search_filter.txt', 'utf-8', (err, data) => {
  if (!err) searchFilters = data.split('\n');
});

app.use('/video', videoRoutes);

app.all('*', (req, res) => {
  res
    .status(HttpStatus.NOT_FOUND.code)
    .send(
      new Response(
        HttpStatus.NOT_FOUND.code,
        HttpStatus.NOT_FOUND.status,
        'This route did not defined on the server.'
      )
    );
});

app.listen(PORT, () =>
  logger.info(`Server running on: ${ip.address()}:${PORT}`)
);
