/**
 * Created by bleonard on 6/20/17.
 */
import {PipeTransform, Pipe} from '@angular/core';
//import {ITimesheet} from '../../timesheet/timesheet';

@Pipe({
  name: 'filterTracksLengthPipe',
  pure: false
})
export class FilterTracksLengthPipe implements PipeTransform {

  constructor() {}

  transform(value: any[], filterBy): any[] {
    let filteredData: Array<any> = value;
    filteredData = this.filterItem(filteredData, filterBy);
    return filteredData;
  };

  filterItem(data: string[], filterBy: any) {
    let flag = false;
    let previousPropFlag = true;
    let tempArray: Array<any> = [];
    let filterProps: string[] = Object.keys(filterBy);
    data.forEach((item: any) => {
      flag = false;
      if(item.playtime_min >= filterBy.min && item.playtime_min <= filterBy.max){
        flag = true;
      }

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
