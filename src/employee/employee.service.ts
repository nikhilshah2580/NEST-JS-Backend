import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from './entities/employee.entity';
import { Company } from '../company/entities/company.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeRepository.findOne({
      where: {
        email: createEmployeeDto.email,
      },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee with this email already exists');
    }

    const company = await this.companyRepository.findOne({
      where: {
        id: createEmployeeDto.companyId,
      },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with ID ${createEmployeeDto.companyId} not found`,
      );
    }

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      company,
    });

    return this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      relations: {
        company: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: {
        id,
      },
      relations: {
        company: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existingEmployee = await this.employeeRepository.findOne({
        where: {
          email: updateEmployeeDto.email,
        },
      });

      if (existingEmployee) {
        throw new ConflictException('Employee with this email already exists');
      }
    }

    if (updateEmployeeDto.companyId) {
      const company = await this.companyRepository.findOne({
        where: {
          id: updateEmployeeDto.companyId,
        },
      });

      if (!company) {
        throw new NotFoundException(
          `Company with ID ${updateEmployeeDto.companyId} not found`,
        );
      }

      employee.company = company;
    }

    Object.assign(employee, updateEmployeeDto);

    return this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);

    await this.employeeRepository.remove(employee);
  }
}
