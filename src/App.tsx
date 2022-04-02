import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CircularProgress,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useFetch } from "use-http";

const RESOURCE_ID = "5dcbd34b-8103-4207-b7c9-571ec51846de";

type BusRecord = {
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

const keysButInHebrew: any = {
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

type SortDir = "DESC" | "ASC";

const App = () => {
  const [limit, setLimit] = useState(28014);
  const [sortField, setSortField] = useState<keyof BusRecord>("_id");
  const [sortDir, setSortDir] = useState<SortDir>("DESC");

  const {
    get,
    loading,
    error,
    data = [],
  } = useFetch(
    `https://data.gov.il/api/3/action/datastore_search?resource_id=${RESOURCE_ID}&limit=${limit}&sort=${sortField}+${sortDir}`,
    {},
    []
  );



  const slicedData = useMemo(() => {
    if (!data || !data.result || !data.result.records) {
      return [];
    }
    return (data.result.records as BusRecord[]).slice(0, 100);
  }, [data]);

  const BusRecordCards = useMemo(
    () =>
      slicedData.map((record) => (
        <Box>
          <Card sx={{ margin: 10 }}>
            {Object.keys(record).map((key) => (
              <Typography>
                {key}: {record[key]}
              </Typography>
            ))}
          </Card>
        </Box>
      )),
    [slicedData]
  );

  useEffect(() => {
    get();
  }, [sortField]);

  if (loading) {
    return <CircularProgress />;
  }
  return (
    <>
      <div>loaded {data.result.total} records</div>
      <Box>
        <FormControl>
          <InputLabel id="sort-field">שדה מיון</InputLabel>
          <Select
            labelId="sort-field"
            id="sort-field-select"
            value={sortField}
            label="שדה מיון"
            onChange={(event) =>
              setSortField(event.target.value as keyof BusRecord)
            }
          >
            {Object.keys(data.result.records[0]).map((key) => (
              <MenuItem value={key}>{keysButInHebrew[key]}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <div>{BusRecordCards}</div>
    </>
  );
};

export default App;
