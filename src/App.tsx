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
  Stack,
} from "@mui/material";
import { useFetch } from "use-http";
import { styled } from "@mui/system";
import {
  BusLineData,
  BusRecord,
  keysButInHebrew,
  opeatorIdColor,
  Filters,
  SortDir,
} from "./types";

const RESOURCE_ID = "5dcbd34b-8103-4207-b7c9-571ec51846de";

const StyledTypography = styled(Typography)({
  fontSize: 15,
  fontWeight: "bold",
});

const filters: Filters = {
  _id: undefined,
  OperatorId: undefined,
  operator_nm: undefined,
  ClusterId: undefined,
  cluster_nm: undefined,
  OperatorLineId: undefined,
  OfficeLineId: undefined,
  trip_year: undefined,
  trip_month: undefined,
  rishui: undefined,
  eibizua: undefined,
  hakdama: undefined,
  eihurim: undefined,
  takin: undefined,
  loberishui: undefined,
};

const App: React.FC = () => {
  const [limit, setLimit] = useState(28014);
  const [sortField, setSortField] = useState<keyof BusRecord>("_id");
  const [sortDir, setSortDir] = useState<SortDir>("DESC");
  // filter by url query
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
    `https://data.gov.il/api/3/action/datastore_search?resource_id=${RESOURCE_ID}&limit=${limit}&sort=${sortField}+${sortDir}&filters=${{}}`,
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

  const mappedData = useMemo(
    () =>
      slicedData.map<BusLineData>((record) => {
        const {
          chanceNotToCome,
          chanceToComeEarly,
          chanceToDelay,
          changeToArriveOnTime,
        } = calcReliability(record);
        return {
          lineNumber: record.OperatorLineId,
          areaName: record.cluster_nm,
          operatorName: record.operator_nm,
          chanceNotToCome,
          chanceToComeEarly,
          chanceToDelay,
          changeToArriveOnTime,
        };
      }),
    [slicedData]
  );

  const cards = useMemo(
    () =>
      mappedData.map((bus) => (
        <Box sx={{ dir: "rtl", textAlign: "right" }}>
          <Card
            sx={{
              margin: 10,
              boxShadow: "0px 0px 0px 5px " + opeatorIdColor[bus.operatorName],
            }}
          >
            <StyledTypography>מספר קו: {bus.lineNumber}</StyledTypography>
            <StyledTypography>שם מפעיל: {bus.operatorName}</StyledTypography>
            <StyledTypography>אזור: {bus.areaName}</StyledTypography>
            <StyledTypography>
              סיכוי לא להגיע: {bus.chanceNotToCome}
            </StyledTypography>
            <StyledTypography>
              סיכוי להגיע בזמן: {bus.changeToArriveOnTime}
            </StyledTypography>
            <StyledTypography>סיכוי לאחר: {bus.chanceToDelay}</StyledTypography>
            <StyledTypography>
              סיכוי להקדים: {bus.chanceToComeEarly}
            </StyledTypography>
          </Card>
        </Box>
      )),
    [mappedData]
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
            onChange={
              (event: any) =>
                setTimeout(
                  () => setLineNumber(event.target.value as unknown as number),
                  100
                ) // yes, this is how i do debounce. fight me
            }
          />
        </FormControl>
      </Box>
      <Stack direction="column" spacing={2}>
        {cards}
      </Stack>
    </>
  );
};

export default App;
