import { Component } from '@angular/core';
import {isUndefined} from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Chart App';
  showChart = false;
  lineChartLegend = true;
  lineChartType = 'line';
  lineChartOptions: any = {
    responsive: true
  };
  lineChartData: Array<any>= [];
  lineChartLabels = [];
  lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  convertFile(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/vnd.ms-excel') {
      document.getElementById('errorMessage').innerHTML = '';
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const chartData = this.convertCSVToJSON(text);
      this.lineChartData = [];
      for (const data of chartData.chartData) {
        this.lineChartData.push({data: data.data, label: data.label});
      }
      this.lineChartLabels = chartData.chartLabel;
      this.showChart = true;
    };
    reader.readAsText(file);
  }else {
      this.showChart = false;
      document.getElementById('errorMessage').innerHTML = 'Only .csv file is allowed';
    }
  }

 public convertCSVToJSON(text: string) {
    let csvData = [];
    csvData = text.split('\n');
   const jsonResult = [];
   const seriesList = [];
    let yearsList = [];
  // let yearIndex = 0
for (let index = 0; index < csvData.length; index++) {
  const jsonObj = {};
 // yearIndex = 0;
  const csvRow = csvData[index];
  const currentSeries = csvRow.split(',');
  seriesList.push(currentSeries[0]);
  jsonObj['label'] = currentSeries[0];
  jsonObj['data'] = [];
  jsonObj['rawSeriesData'] = csvRow;
  for (let yearIndex = 0; yearIndex < currentSeries.length; yearIndex++) {
    if (yearIndex > 0) {
      const details = currentSeries[yearIndex];
     if (!isUndefined(details)) {
      const currentYear = Number(details.split('|')[0]);
      if (yearsList.indexOf(currentYear) === -1) {
        yearsList.push(currentYear);
      }
    }
    }
  }
  jsonResult.push(jsonObj);
}
    yearsList = yearsList.sort((n1, n2) => n1 - n2);
for (let index = 0; index < jsonResult.length; index++) {
const currentRecord = jsonResult[index];
  for (let yearIndex = 0; yearIndex < yearsList.length; yearIndex++) {
    const currentYear = yearsList[yearIndex];
    const rawSeriesData = currentRecord.rawSeriesData;
    jsonResult[index]['data'] = jsonResult[index]['data'] || [];
    const searchIndex = rawSeriesData.indexOf(currentYear);
    if (searchIndex !== -1) {
      let data = rawSeriesData.substring(searchIndex + currentYear.toString().length);
data = data.substring(1, data.indexOf(','));
if (Number(data)) {
  jsonResult[index]['data'].push(Number(data));
}
    }else {
      jsonResult[index]['data'].push(0);
    }
  }
}
return {chartData: jsonResult, chartLabel: yearsList};
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
