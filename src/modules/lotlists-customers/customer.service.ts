import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Customer as CustomerEntity } from './customer.entity';

import { LotList } from 'src/modules/lotlists/lots.list.entity';
import type { LotNumber, Customer } from '../interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(LotList)
    private lotListRepository: Repository<LotList>,
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async findAll(): Promise<LotNumber[]> {
    const lotListNumbers = await this.lotListRepository
      .createQueryBuilder('lot_list')
      .where('lot_list.inUse = :inUse', { inUse: true })
      .andWhere('lot_list.dateEnd > :currentTime', {
        currentTime: new Date(),
      })
      // .andWhere('lot_list.dateStart < :currentTime', {
      //   currentTime: new Date(),
      // })
      .orderBy('lot_list.lotNumber', 'DESC')
      .execute();

    const lots = await this.customerRepository.find({
      select: { lotNumber: true },
    });
    const numbers1 = lotListNumbers.map((item) => {
      const number = item['lot_list_lotNumber'];

      return number;
    });

    const numbers2 = lots.map((user) => {
      const number = user.lotNumber;

      return number;
    });

    const numbersIntersection =
      numbers2.length > 0
        ? numbers1.filter(
            (item1: number) =>
              !numbers2.find((item2: number) => item1 === item2),
          )
        : numbers1;
    const lotNumbers = Array.isArray(numbersIntersection)
      ? numbersIntersection.map((item) => {
          const lotNumber: LotNumber = {
            lotNumber: item,
            unitPrice: lotListNumbers[0]['lot_list_unitPrice'],
          };
          return lotNumber;
        })
      : null;

    return lotNumbers;
  }

  async findAllCustomers(): Promise<CustomerEntity[]> {
    const lots = await this.customerRepository.find();

    return lots;
  }

  async createList(listName: string) {
    const n = 1000;
    const range = Array.from({ length: n + 1 }, (v, k) => k);
    const lotList = await this.lotListRepository.findOneBy({
      listName: listName['title'],
    });

    if (lotList) {
      throw new InternalServerErrorException('list already exists');
    }
    range.forEach((item) => {
      if (item > 0) {
        const lotList = new LotList();
        lotList.listName = listName['title'];
        lotList.inUse = true;
        lotList.lotNumber = item;
        lotList.dateStart = new Date(listName['startDate']);
        lotList.dateEnd = new Date(listName['endDate']);
        lotList.unitPrice = 10;
        try {
          return this.lotListRepository.insert(lotList);
        } catch (error) {
          console.log(error);
          throw new InternalServerErrorException(error);
          return false;
        }
      }
    });
    return true;
  }

  async create(user: Customer) {
    const lotList = await this.lotListRepository
      .createQueryBuilder('lot_list')
      .select('listName')
      .where('lot_list.inUse = :inUse', { inUse: 1 })
      .andWhere('lot_list.dateEnd > :currentTime', {
        currentTime: new Date(),
      })
      .execute();

    return user.lotNumber.map((lotNumber) => {
      const userDb = new CustomerEntity();
      userDb.firstName = user.firstName;
      userDb.lastName = user.lastName;
      userDb.address = user.address;
      userDb.phoneNumber = user.phoneNumber;
      userDb.lotNumber = lotNumber.value;
      userDb.postalCode = user.postalCode;
      userDb.lotListName = lotList[0].listName;
      try {
        this.customerRepository.save(userDb);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
