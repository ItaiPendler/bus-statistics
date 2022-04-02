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
  TextField,
} from "@mui/material";
import { useFetch } from "use-http";
import { styled } from "@mui/system";

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

const StyledTypography = styled(Typography)({
  fontSize: 15,
  fontWeight: "bold",
});
const App = () => {
  const [limit, setLimit] = useState(28014);
  const [sortField, setSortField] = useState<keyof BusRecord>("_id");
  const [sortDir, setSortDir] = useState<SortDir>("DESC");
  const [lineNumber, setLineNumber] = useState(0);

  const calcReliability = (record: BusRecord) => {
    const totalRides =
      record.takin + record.eibizua + record.hakdama + record.eihurim;
    const chanceNotToCome = ((record.eibizua / totalRides) * 100).toFixed(2);
    const changeToArriveOnTime = ((record.takin / totalRides) * 100).toFixed(2);
    const chanceToDelay = ((record.eihurim / totalRides) * 100).toFixed(2);
    const chanceToComeEarly = ((record.hakdama / totalRides) * 100).toFixed(2);
    return {
      chanceNotToCome,
      changeToArriveOnTime,
      chanceToDelay,
      chanceToComeEarly,
    };
  };

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
    let retval = data.result.records as BusRecord[];
    if (lineNumber) {
      retval = retval.filter((item, index) => {
        if (item.OperatorLineId == lineNumber) {
          console.log("should be in there ");
          return true;
        }
        return false;
      });
    }
    return retval.slice(0, 1000);
  }, [data, lineNumber]);

  const BusRecordCards = useMemo(
    () =>
      slicedData.map((record) => {
        const {
          chanceNotToCome,
          chanceToComeEarly,
          chanceToDelay,
          changeToArriveOnTime,
        } = calcReliability(record);
        return (
          <Box sx={{ dir: "rtl", textAlign: "right" }}>
            <Card sx={{ margin: 10 }}>
              {Object.keys(record).map((key) => {
                return (
                  <>
                    <Typography>
                      {keysButInHebrew[key]}: {record[key as keyof BusRecord]}
                    </Typography>
                  </>
                );
              })}

              <StyledTypography>
                סיכוי לא להגיע: {chanceNotToCome}
              </StyledTypography>
              <StyledTypography>
                סיכוי להגיע בזמן: {changeToArriveOnTime}
              </StyledTypography>
              <StyledTypography>סיכוי לאחר: {chanceToDelay}</StyledTypography>
              <StyledTypography>
                סיכוי להקדים: {chanceToComeEarly}
              </StyledTypography>
            </Card>
          </Box>
        );
      }),
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
          <TextField
            label="מספר קו"
            type="number"
            onChange={(event) =>
              setTimeout(
                () => setLineNumber(event.target.value as unknown as number),
                100
              )
            }
          />
        </FormControl>
      </Box>
      <div>{BusRecordCards}</div>
    </>
  );
};

export default App;
