
import { AuthRefreshToken } from 'src/modules/authentication/auth-refresh-token.entity';
import { Customer } from 'src/modules/lotlists-customers/customer.entity';
import { LotList } from 'src/modules/lotlists/lots.list.entity';
import { User } from 'src/modules/users/users.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Customer, LotList, User, AuthRefreshToken],
});
