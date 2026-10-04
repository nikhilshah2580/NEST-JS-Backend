import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Company } from './src/company/entities/company.entity';
import { Employee } from './src/employee/entities/employee.entity';
import { User } from './src/users/entities/user.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [Company, Employee, User],
  migrations: ['src/migrations/*.ts'],

  synchronize: false,
});

export default dataSource;
