import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'trackSeconds'
})
export class TrackSecondsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let strValue = '';
    if (value != null) {
      if (value < 10) {
        strValue = '0' + value.toString();
      } else {
        strValue = value.toString();
      }
    } else {
      strValue = '00';
    }

    return strValue;
  }

}
