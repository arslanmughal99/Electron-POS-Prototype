import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { AppSettings } from '../../interfaces/appSettings-ineterface';
import { LocalStorageHandlerService } from '../../services/localstorage/local-storage-handler.service';
import { BaseChartDirective, Label } from 'ng2-charts';
import { ChartOptions, ChartDataSets, ChartType } from 'chart.js';
import * as _ from 'lodash';
import { DashboardData } from '../../interfaces/dashboardData-interface';
import { CalcuatedEarnigns } from '../../interfaces/calculate-earnings-interface';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Polar chart handling logic
  // tslint:disable: member-ordering
  public polarAreaChartLabels: Label[] = ['bills'];
  public polarAreaChartData: ChartDataSets[] = [{data: [1, 2, 3, 4, 5], label: 'Bills', borderColor: '#FF6384', steppedLine: true}];
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'line';
  public polarAreaChartOptions: ChartOptions = {
    legend: {display: true},
    scales: { xAxes: [{gridLines: {color: '#7a7a7a', lineWidth: 0.2}}], yAxes: [{gridLines: {color: '#7a7a7a', lineWidth: 0.2}}] },
  };

  // Earning Chart Data
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Earnings' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Sales Tax' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Total' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{gridLines: {color: '#7a7a7a', lineWidth: 0.2}}], yAxes: [{gridLines: {color: '#7a7a7a', lineWidth: 0.2}}] },
  };

  // Bar chart data
  public barChartOptions: ChartOptions = {
    responsive: true,
    title: {text: 'Most Popular Categories', display: true, fontColor: '#919191', fontSize: 40},
    // tslint:disable-next-line: max-line-length
    scales: { xAxes: [{gridLines: {color: '#7a7a7a', lineWidth: 0.2}}], yAxes: [{gridLines: {color: '#7a7a7a', lineWidth: 0.2}, ticks: {beginAtZero: true}}] },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  // tslint:disable-next-line: max-line-length
  public barChartData: ChartDataSets[] = [{data: [], label: null}];
  // backgroundColor: ['#FF6384', '#4BC0C0', '#5EB5EF', '#FFD778', '#A376FF'];
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  appSettings: AppSettings;
  date = new Date();
  billsCount: number;
  billCountAllTime: any[] = [];
  private _allBills: any[];
  private report: DashboardData;
  private earningsData: CalcuatedEarnigns[] = [];



  constructor(
    private _dashboardHandler: DashboardService,
    private _localStorageHandler: LocalStorageHandlerService
    ) {}

  ngOnInit() {
    this.appSettings = this._localStorageHandler.getFromLocalStorage('appSettings');
    // Initilize bills before anything
    this._dashboardHandler.getAllRecords
    .then((bills: any[]) => {
      this.earningsData = this._dashboardHandler.calculateEarnnings(bills);
      this._prepareEarningsData(this.earningsData);
      this._allBills = bills;
      this.billCountAllTime = this._dashboardHandler.calculateBillsCountLastDays(this._allBills as any[]);
      this._preparePolarChartData(this.billCountAllTime);
       // Fetch calculated report from service
      this._dashboardHandler.getReport(this._allBills)
      .then(report => {
        this.report = report as DashboardData;
        this._prepareChartData(this.report);
        this.billsCount = this.report.totalBillsCount;
      });
    });

  }


  // generate dataset for barchart
  private _prepareChartData(report: DashboardData) {
    this.barChartData = [];
    let rawDataSet: ChartDataSets[] = [];
    const rawCatReport = report.mostSelledCategory;

    // tslint:disable-next-line: max-line-length
    _.forEach(_.take(_.orderBy(rawCatReport, catItem => new Date(catItem.date), ['desc']), 5), (catObject) => {  // sort by date and take 5 and iterate each object
      this.barChartLabels.push(catObject.date.toString());  // Push bottoms labels to chartsLabel

      // Create a raw data set with only labels set but not data is set i.e {data: [], label: "category Name"}
      _.forEach(catObject.categories, (catCount, catName) => {
        if (!_.find(rawDataSet, each => each.label === catName.toString())) {
          rawDataSet.push({data: [], label: catName.toString()});
        }
      });
  });

  _.forEach(rawDataSet, (eachRawSet) => {
    let flag = false;
    const indexofdataset = rawDataSet.indexOf(eachRawSet);
    _.forEach(_.take(_.orderBy(rawCatReport, catItem => new Date(catItem.date), 'desc'), 5), (catObject) => {
      _.forEach(catObject.categories, (catValue, catName) => {
        if (eachRawSet.label === catName.toString()) {
          rawDataSet[indexofdataset].data.push(catValue);
          flag = true;
        }

      });
        if (!flag) { // Will push 0 in data if label does not exist
          rawDataSet[indexofdataset].data.push(0);
        } else {
          flag = false;
        }
    });
  });

  // Will take 5 most popular categories
  rawDataSet = _.take(_.orderBy(rawDataSet, eachOrder => _.sum(eachOrder.data), 'desc'), 5);
  this.barChartData = rawDataSet;

  }

    private _preparePolarChartData(billDataArray: any[]) {
      this.polarAreaChartData[0].data = [];
      this.polarAreaChartLabels = [];
      billDataArray.forEach((each) => {
        this.polarAreaChartData[0].data.push(each[1]);
        this.polarAreaChartLabels.push(each[0]);
      });

    }

    private _prepareEarningsData(detailsArray: CalcuatedEarnigns[]) {
      this.lineChartData[0].data = [];  // earnings
      this.lineChartData[1].data = []; // salestax
      this.lineChartData[2].data = []; // Total
      this.lineChartLabels = [];  // labels
      detailsArray.forEach(eachDetail => {
        this.lineChartData[0].data.push(eachDetail.total); // adding earnings
        this.lineChartData[1].data.push(eachDetail.salesTax); // adding sales tax
        this.lineChartData[2].data.push(eachDetail.salesTax + eachDetail.total); // adding sales tax
        this.lineChartLabels.push(eachDetail.date);
      });
    }

}
