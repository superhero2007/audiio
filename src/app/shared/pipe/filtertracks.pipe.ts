import {PipeTransform, Pipe} from '@angular/core';
//import {ITimesheet} from '../../timesheet/timesheet';

@Pipe({
  name: 'filterTracksPipe',
  pure: false
})
export class FilterTracksPipe implements PipeTransform {

  constructor() {}

  transform(value: any[], filterBy): any[] {
    let filteredData: Array<any> = value;

    if (filterBy != undefined) {

      let filterProps: string[] = Object.keys(filterBy);

      if (filterProps.length > 0) {

        filteredData = this.filterItem(filteredData, filterBy);

      } else {

        filteredData = value;
      }

    } else {

      filteredData = value;
    }
    return filteredData;
  };

  filterItem(data: string[], filterBy: string[]) {
    let flag = false;
    let previousPropFlag = true;
    let tempArray: Array<any> = [];
    let filterProps: string[] = Object.keys(filterBy);

    data.forEach((item: any) => {
      flag = false;
      previousPropFlag = true;

      filterProps.forEach((prop: any) => {
        let currentProp: any[] = <any>filterBy[prop];
        flag = false;
        if (previousPropFlag) {
          previousPropFlag = false;
          if(item[currentProp['value']] == 1){
            flag = true;
            previousPropFlag = true;
          }
          if(/energy/i.test(currentProp['value'])){
            if(item.energy == currentProp['name']){
              flag = true;
              previousPropFlag = true;
            }
          }
        }
      });

      if (flag) {
        tempArray.push(item);
      }
    });

    if (tempArray.length <= 0) {
      tempArray = [-1];
    }
    return tempArray;
  }
}
