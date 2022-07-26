const QUERY = {
  INSERT_VIDEO: 'INSERT INTO videos (id, title, date) VALUES (?)',
  SELECT_VIDEOS: 'SELECT * FROM videos ORDER BY date DESC LIMIT 1000',
  SELECT_VIDEO: 'SELECT * FROM videos WHERE id = ?',
  DELETE_VIDEO: 'DELETE FROM videos WHERE id = ?',
};

export default QUERY;
