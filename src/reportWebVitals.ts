import { ReportHandler } from "web-vitals";

const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (process.env.NODE_ENV !== "production" && onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      console.info("Reporting important metrics at " + new Date(Date.now()));
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
