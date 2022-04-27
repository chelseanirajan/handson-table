import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from './data.service';
import Handsontable from 'handsontable';
import {HotTableRegisterer} from '@handsontable/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mappingId = 123;
  isVisible = false;
  ssstrMaseterId = 1;
  private hotInstance: Handsontable;

  public onAfterInit = (hotInstance) => {
    this.hotInstance = hotInstance;
  };

  @ViewChild('HotTableComponent') hotTableComponent;
  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  errorMessage = '';
  columnValidator = {
    0: (value, callBack, values) => {

      const names = (values || this.rows).map(row => row.name).filter(name => !!name);

      console.log('names :', names);
      console.log('values :', values);
      console.log('value :', value);
      const hasDublicate = names.includes(value);
      callBack(!hasDublicate, 'Duplicate Date inserted..');
    }, 1: (value, callback, values) => {
      const isEmailValid = !value || /.+@.+/.test(value);
      callback(isEmailValid, 'Invalid Email Address');
    }
  };
//   var vals = hot.getDataAtCol(hot.getSelectedLast()[1]);
//   console.log(vals.indexOf(value), vals);
//
//   if (vals.indexOf(value) < 0 && value !== null) {
//   console.log('You are OK')
//   callback(true);
// } else {
//   console.log('I already have this value')
//   callback(false);
// }
  uniqueValidator = (value, callback) => {

  };

  isChecked = false;

  rows: any[] = [];
  cols: any[];
  colHeaders: any[];
  emailValidator = (value, callback) => {
    setTimeout(() => {
      if (/.+@.+/.test(value)) {
        callback(true);
      } else {
        callback(false);
      }
    }, 1000);
  };
  columns: any[] = [
    {
      data: 'name',
      isRequired: true,

      validator: this.columnValidator[0]
    },
    {
      data: 'email',
      validator: this.columnValidator[1],
    }
  ];

  constructor(private dataService: DataService) {
    this.cols = this.getColModel();
    this.colHeaders = this.getColModel().map(i => i.data);
  }

  doLoad(): void {
    this.isVisible = !this.isVisible;
  }

  onSubmit(): void {
    const data = [];
    this.rows.forEach((row, index) => {
      if (!this.hotRegisterer.getInstance(this.id).isEmptyRow(index)) {
        row.mappingId = this.mappingId;
        row.ssstrMaseterId = this.ssstrMaseterId;
        console.log('emptyfield', row.name);
        data.push(row);
        if (row.name === null) {
          this.errorMessage = 'name cannot be empty';
        } else if (row.email === null) {
          this.errorMessage = 'eamil cannot be empty';
        }

      }
    });

    console.log(data);
  }

  setError(isValid, message) {
    if (!isValid) {
      this.errorMessage = message;
    }
    console.log(this.errorMessage, message);
  }

  removeFirstItem(value, values): string[] {
    const clonedValues = [...values];
    const index = clonedValues.findIndex(v => v.name === value);
    if (index > -1) {
      clonedValues.splice(index, 1);
    }
    console.log('values-clonevalues-value', values, clonedValues, value);
    return clonedValues;
  }

  oncCheck(): void {
    this.isChecked = true;
    this.errorMessage = '';
    const hotInstaceData = this.hotRegisterer.getInstance(this.id);
    hotInstaceData.getData().forEach((values, i) => {
      if (!hotInstaceData.isEmptyRow(i)) {
        for (let j = 0; j < values.length; j++) {
          if (!this.errorMessage) {
            this.columnValidator[j](values[j], this.setError.bind(this), this.removeFirstItem(values[j], this.rows));
          }
        }
      }
    });
  }


  ngOnInit(): void {
    this.dataService.getData().then(
      rows => {
        this.rows = [{name: null, email: null}, {name: null, email: null}, {name: null, email: null}, {name: null, email: null}];
      });
  }

  getColModel(): any[] {
    const colModel: any[] = [];

    for (let i = 0; i < 5; i++) {
      colModel.push({
        data: 'col' + i
      });
    }

    return colModel;
  }

  afterChange = (changes) => {
    this.isChecked = false;
    const hotInstance = this.hotRegisterer.getInstance(this.id);
    (changes || []).forEach(([row, prop, oldValue, newValue]) => {
      if (hotInstance.getData().length > 4 && hotInstance.isEmptyRow(row)) {
        hotInstance.alter('remove_row', row);
        console.log('yes remove', row);
      }
    });
    console.log('changes ', changes);
  };

  hasValue(): boolean {
    if(this.hotRegisterer){
      const hotInstance = this.hotRegisterer.getInstance(this.id)
      return this.rows.some((row, index) => {
        return !hotInstance.isEmptyRow(index);
      })
    }
  }
}
