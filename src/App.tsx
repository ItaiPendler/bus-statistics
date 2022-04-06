import React, { useEffect, useMemo, useState } from "react";
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
import { BusRecord, keysButInHebrew, SortDir } from "./types";

const RESOURCE_ID = "5dcbd34b-8103-4207-b7c9-571ec51846de";

const StyledTypography = styled(Typography)({
  fontSize: 15,
  fontWeight: "bold",
});

const App: React.FC = () => {
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

  useEffect(() => {
    get();
  }, [sortField]);

  const slicedData = useMemo(() => {
    if (!data || !data.result || !data.result.records) {
      return [];
    }
    let retval = data.result.records as BusRecord[];
    if (lineNumber) {
      retval = retval.filter(
        (item, index) => item.OperatorLineId == lineNumber
      );
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
              <StyledTypography>
                מספר קו: {record.OperatorLineId}
              </StyledTypography>
              <StyledTypography>
                שם מפעיל: {record.operator_nm}
              </StyledTypography>
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
              )// yes, this is how i do debounce. fight me
            }
          />
        </FormControl>
      </Box>
      <div>{BusRecordCards}</div>
    </>
  );
};

export default App;
