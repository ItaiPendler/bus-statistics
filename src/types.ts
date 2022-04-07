export type BusRecord = {
  _id: number;
  OperatorId: number;
  operator_nm: string;
  ClusterId: number;
  cluster_nm: string;
  OperatorLineId: number;
  OfficeLineId: number;
  trip_year: number;
  trip_month: number;
  rishui: number;
  eibizua: number;
  hakdama: number;
  eihurim: number;
  takin: number;
  loberishui: number;
};

export type BusLineData = {
  lineNumber: number;
  operatorName: string;
  areaName: string;
  chanceNotToCome: string;
  chanceToComeEarly: string;
  chanceToDelay: string;
  changeToArriveOnTime: string;
};

export type SortDir = "DESC" | "ASC";

export const opeatorIdColor: Record<string, string> = {
  אגד: "#009e75",
  מטרופולין: "#ea881c",
  קווים: "#032765",
  'בית שמש אקספרס':
};

export const keysButInHebrew: any = {
  _id: "מספר סידורי",
  OperatorId: "מזהה חברה מפעילה",
  operator_nm: "שם חברה מפעילה",
  ClusterId: "מזהה אזור ארצי",
  cluster_nm: "שם אזור ארצי",
  OperatorLineId: "מספר קו של המפעיל",
  OfficeLineId: "מספר סידורי של הקו",
  trip_year: "שנת מסלול",
  trip_month: "חודש מסלול", // מה זה אומר בכלל?
  rishui: "רישוי",
  eibizua: "אי ביצוע נסיעה",
  hakdama: "הקדמה",
  eihurim: "איחור",
  takin: "נסיעה תקינה",
  loberishui: "לא ברישוי", // אין לי מושג מה זה אומר
};
