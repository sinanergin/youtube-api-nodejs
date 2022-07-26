import database from './mysql.config.js';
import Response from './response.js';
import logger from './logger.js';
import QUERY from './video.query.js';
import axios from 'axios';
import dotenv from 'dotenv';
import { searchFilters } from './../index.js';

dotenv.config();

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' },
};

export const pullAllVideos = async (req, res) => {
  logger.info(
    `${req.method} ${req.originalUrl}, fetching Youtube videos from Search API`
  );

  if (!searchFilters || searchFilters.length == 0) {
    res
      .status(HttpStatus.NO_CONTENT.code)
      .send(
        new Response(
          HttpStatus.NO_CONTENT.code,
          HttpStatus.NO_CONTENT.status,
          `There is no search criteria`
        )
      );
  }

  let results = [];
  let queryResult;
  for (const value of searchFilters) {
    queryResult = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${process.env.CHANNEL_ID_1}&q=${value}&type=video&key=${process.env.API_KEY}`
    );
    results.push(...queryResult.data.items);

    queryResult = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${process.env.CHANNEL_ID_2}&q=${value}&type=video&key=${process.env.API_KEY}`
    );
    results.push(...queryResult.data.items);
  }

  let values = results.map((item, index) => [
    index + 1,
    item.snippet.title,
    undefined, //item.snippet.publishedAt
  ]);

  console.log('let values = results.map((item) => [');
  console.log(values);
  database.query(QUERY.INSERT_VIDEO, [...values], (err, result) => {
    console.log(err, result);
    if (!result) {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            `No videos found`
          )
        );
    } else {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            `Videos retrieved`,
            `${result.affectedRows} inserted`
          )
        );
    }
  });
};

export const getAllVideos = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching videos from db.`);

  database.query(QUERY.SELECT_VIDEOS, (error, results) => {
    if (!results) {
      res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Videos were not found`
          )
        );
    } else {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            `Videos retrieved`,
            results
          )
        );
    }
  });
};
export const getVideo = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching videos from db.`);

  database.query(QUERY.SELECT_VIDEO, [req.params.id], (error, results) => {
    if (!results) {
      res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Video by id ${req.params.id} was not found`
          )
        );
    } else {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            `Video retrieved`,
            results[0]
          )
        );
    }
  });
};

export const deleteVideo = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting video`);
  database.query(QUERY.DELETE_VIDEO, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            `Video deleted`,
            results[0]
          )
        );
    } else {
      res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Video by id ${req.params.id} was not found`
          )
        );
    }
  });
};

export default HttpStatus;
