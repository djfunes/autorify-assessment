export interface Trade {
  id: number;
  createdat: string;
  survivor1id: number;
  survivor2id: number;
  itemgivenid: number;
  itemgivenname: string;
  itemreceivedid: number;
  itemreceivedname: string;
  quantitygiven: number;
  quantityreceived: number;
  action: string;
}
