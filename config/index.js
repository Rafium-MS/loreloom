try {
  const dotenv = await import('dotenv');
  dotenv.default.config();
} catch (err) {
  // dotenv not installed, ignore
}

export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const DATABASE_FILE = process.env.DATABASE_FILE;
