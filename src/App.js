import { useEffect, useRef } from "react";
import { gantt } from "../external/codebase/dhtmlxgantt";
import "../external/codebase/dhtmlxgantt.css";
import "./styles.css";

export default function App() {
  const chartRef = useRef(null);

  useEffect(() => {
    gantt.plugins({
      export_api: true
    });
    gantt.init(chartRef.current);
    gantt.parse(data);
  }, []);

  const onBtnClick = () => {
    prepareExportData();
    processExport();
  };

  return (
    <>
      <button onClick={onBtnClick}>Export PDF</button>
      <div ref={chartRef} style={{ width: "100%", height: "90vh" }} />
    </>
  );
}
function prepareExportData() {
  gantt.exportToPDF({
    raw: true
  });

  gantt.message("Export data ready");
}

function processExport() {
  gantt.ajax
    .post({
      url: "https://export.dhtmlx.com/gantt",
      data: gantt.exportRequest
    })
    .then((response) => {
      console.log(response.responseText);
    });
}

gantt.ext.export_api._sendToExport = function (data, type) {
  const convert = gantt.date.date_to_str(
    gantt.config.date_format || gantt.config.xml_date
  );

  if (data.config) {
    data.config = gantt.copy(
      gantt.ext.export_api._serializableGanttConfig(data.config)
    );
    gantt.ext.export_api._markColumns(data, type);

    if (data.config.start_date && data.config.end_date) {
      if (data.config.start_date instanceof Date) {
        data.config.start_date = convert(data.config.start_date);
      }

      if (data.config.end_date instanceof Date) {
        data.config.end_date = convert(data.config.end_date);
      }
    }
  }

  if (gantt.env.isNode) {
    const url = data.server || gantt.ext.export_api._apiUrl;
    const pack = {
      type,
      store: 0,
      data: JSON.stringify(data)
    };

    const callbackFunction =
      data.callback ||
      function (response) {
        // tslint:disable-next-line no-console
        console.log(response);
      };

    return gantt.ext.export_api._xdr(url, pack, callbackFunction);
  }

  if (data.callback) {
    return gantt.ext.export_api._ajaxToExport(data, type, data.callback);
  }

  const form = gantt.ext.export_api._createHiddenForm();
  form.firstChild.action = data.server || gantt.ext.export_api._apiUrl;
  form.firstChild.childNodes[0].value = JSON.stringify(data);
  form.firstChild.childNodes[1].value = type;

  gantt.exportRequest = {
    data: JSON.stringify(data),
    type: type
  };

  //form.firstChild.submit();
};

const data = {
  tasks: [
    {
      id: 1,
      text: "Task #1",
      start_date: "02-05-2023 00:00",
      duration: 5,
      parent: "0",
      open: true,
      type: "project"
    },
    {
      id: 2,
      text: "Task #1.1",
      start_date: "03-05-2023 00:00",
      duration: 2,
      parent: "1"
    },
    {
      id: 3,
      text: "Task #1.2",
      start_date: "06-05-2023 00:00",
      duration: 3,
      parent: "1"
    },
    {
      id: 4,
      text: "Task #1.3",
      start_date: "10-05-2023 00:00",
      duration: 2,
      parent: "1"
    },
    {
      id: 5,
      text: "Task #1.4",
      start_date: "13-05-2023 00:00",
      duration: 2,
      parent: "1"
    },
    {
      id: 6,
      text: "Task #1.5",
      start_date: "16-05-2023 00:00",
      duration: 2,
      parent: "1"
    },
    {
      id: 7,
      text: "Task #1.6",
      start_date: "19-05-2023 00:00",
      duration: 2,
      parent: "1"
    },
    {
      id: 8,
      text: "Task #1.7",
      start_date: "22-05-2023 00:00",
      duration: 2,
      parent: "1"
    },
    {
      id: 9,
      text: "Task #1.8",
      start_date: "25-05-2023 00:00",
      duration: 2,
      parent: "1"
    }
  ],
  links: [
    { id: "23", source: "2", target: "3", type: "0" },
    { id: "34", source: "3", target: "4", type: "0" },
    { id: "45", source: "4", target: "5", type: "0" },
    { id: "56", source: "5", target: "6", type: "0" },
    { id: "67", source: "6", target: "7", type: "0" },
    { id: "78", source: "7", target: "8", type: "0" },
    { id: "89", source: "8", target: "9", type: "0" }
  ]
};
