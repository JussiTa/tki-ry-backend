export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  timezone: string;
  typeormSync: boolean;
}

export enum NodeEnv {
  Dev = 'development',
  Prod = 'production',
}

export interface EnvironmentVariables {
  nodeEnv: NodeEnv;
  jwtSecret: string;
  jwtRefreshSecret: string;
  database: DatabaseConfig;
}

export default (): EnvironmentVariables => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret) {
    throw new Error('Jwt secret is not set in env');
  }

  if (!jwtRefreshSecret) {
    throw new Error('Jwt refresh secret is not set in env');
  }

  return {
    nodeEnv: process.env.NODE_ENV === NodeEnv.Prod ? NodeEnv.Prod : NodeEnv.Dev,
    jwtSecret,
    jwtRefreshSecret,
    database: {
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
      timezone: process.env.DB_TIMEZONE,
      typeormSync: process.env.DB_TYPEORM_SYNC === 'true',
    },
  };
};
