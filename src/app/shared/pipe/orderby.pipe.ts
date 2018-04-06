/*
 * Example use
 *		Basic Array of single type: *ngFor="let todo of todoService.todos | orderBy : '-'"
 *		Multidimensional Array Sort on single column: *ngFor="let todo of todoService.todos | orderBy : ['-status']"
 *		Multidimensional Array Sort on multiple columns: *ngFor="let todo of todoService.todos | orderBy : ['status', '-title']"
 */

import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'orderByPipe', pure: false})
export class OrderByPipe implements PipeTransform {

  value: string[] = [];

  static _orderStringsByComparator(a: string, b: string): number {
    if(!a) a = '';
    if(!b) b = '';
    if(a.toLowerCase() > b.toLowerCase()) return 1;
    else return -1;
  }

  static _orderDatesByComparator(a: Date, b: Date): number {
    if(a.toString() == 'Invalid Date' || !a) a = new Date();
    if(b.toString() == 'Invalid Date' || !b) b = new Date();
    if(a > b) return 1;
    else return -1;
  }

  static _orderNumbersByComparator(a: number, b: number): number {
    if(!a) a = 0;
    if(!b) b = 0;
    if(a > b) return 1;
    else return -1;
  }

  transform(input: any, config: string = '+'): any {
    if (input != undefined) {
      this.value = [...input];
      var value = this.value;

      if (!Array.isArray(value)) return value;

      var propertyToCheck: string = !Array.isArray(config) ? config : config[0];

      var desc = propertyToCheck.substr(0, 1) == '-';

      if (!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+') {
        return !desc ? value.sort() : value.sort().reverse();
      } else {
        var property: string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
          ? propertyToCheck.substr(1)
          : propertyToCheck;

        // Sort TPE Values
        if(property == 'payRegularUnits' || property == 'payRate' || property == 'billRegularUnits'
            || property == 'billRegularRate' || property == 'payOverrideCode') {
          return value.sort(function(a: any, b: any){
            if (a['timePoolEntryRows'] && b['timePoolEntryRows']) {
              if(property == 'payOverrideCode') {
                return !desc
                    ? OrderByPipe._orderStringsByComparator(a['timePoolEntryRows'][0][property], b['timePoolEntryRows'][0][property])
                    : -OrderByPipe._orderStringsByComparator(a['timePoolEntryRows'][0][property], b['timePoolEntryRows'][0][property]);
              } else {
                return !desc
                    ? OrderByPipe._orderNumbersByComparator(a['timePoolEntryRows'][0][property], b['timePoolEntryRows'][0][property])
                    : -OrderByPipe._orderNumbersByComparator(a['timePoolEntryRows'][0][property], b['timePoolEntryRows'][0][property]);
              }
            } else if (a['timePoolEntryRows']){
              return !desc ? 1 : -1
            } else if(b['timePoolEntryRows']) {
              return !desc ? -1 : 1
            } else {
              return 0;
            }
          }); //Sort Dates
        } else if (property == 'weekEndingDate' || property == 'assignmentStartDate') {
          return value.sort(function(a: any, b: any) {
            let dateA = new Date(a[property]);
            let dateB = new Date(b[property]);
            return !desc
                ? OrderByPipe._orderDatesByComparator(dateA, dateB)
                : -OrderByPipe._orderDatesByComparator(dateA, dateB);
          }); //Sort Numbers
        } else if (property == 'assignmentNumber' || property == 'otMultiplier'){
          return value.sort(function(a: any, b: any){
            return !desc
                ? OrderByPipe._orderNumbersByComparator(a[property], b[property])
                : -OrderByPipe._orderNumbersByComparator(a[property], b[property]);
          }); // Sort events by date and resolved status
        } else if (property == 'status'){
            let sortedArrayByDate = value.sort(function(a: any, b: any){
              let dateA = new Date(a.createdOn);
              let dateB = new Date(b.createdOn);
              return -OrderByPipe._orderDatesByComparator(dateA, dateB);
            });
            return sortedArrayByDate.sort(function(a: any, b: any){
              return OrderByPipe._orderStringsByComparator(a.status, b.status);
            });
        } else { // Sort Strings (remaining properties)
          return value.sort(function(a: any, b: any){
            return !desc
                ? OrderByPipe._orderStringsByComparator(a[property], b[property])
                : -OrderByPipe._orderStringsByComparator(a[property], b[property]);
          })
        }
      }
    }
  }
}
