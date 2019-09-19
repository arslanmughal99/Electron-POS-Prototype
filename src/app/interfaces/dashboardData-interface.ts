export interface DashboardData {
    totalBillsCount: number;
    mostSelledCategory: MostSellCat[];
  }

export interface MostSellCat {
  date: Date;
  categories: any[];
}
