import { Injectable } from '@angular/core';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {}

  getData(): Promise<any[]> {
    const rows: any[] = [];

    for (let i = 0; i < 5; i++) {
      rows.push(this.getDataModel(i));
    }

    return of(rows).toPromise();
  }

  getDataModel(rowNum: number): any {
    const dataModel = {};

    for (let i = 0; i < 5; i++) {
      dataModel['col' + i] = 'row-' + rowNum + ', col-' + i;
    }

    return dataModel;
  }
}
