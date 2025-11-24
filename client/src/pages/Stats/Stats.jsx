import React from "react";
import moment from "moment";
import { useParams, Link } from "react-router-dom";
import { getUrlStats } from "../../Services/urlServices.js";
import httpClient from "../../Services/httpClient.js";

const Stats = () => {
  const { code } = useParams();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await getUrlStats(code);
      if (res && res.id) {
        setData(res);
        setError("");
      } else if (res && res.response) {
        if (res.response.status === 404) setError("Not found");
        else setError("Failed to load stats");
      } else {
        setError("Failed to load stats");
      }
      setLoading(false);
    };
    run();
  }, [code]);

  if (loading) return <div style={{ padding: 24 }}><h3>Loading...</h3></div>;
  if (error) return (
    <div style={{ padding: 24 }}>
      <h3>{error}</h3>
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );

  const preferredBase = import.meta.env.VITE_SHORT_BASE_URL || new URL(httpClient.defaults.baseURL).origin;
  const shortBase = preferredBase.replace(/\/$/, "");
  const shortUrl = `${shortBase}/${data.urlCode}`;
  const lastClicked = data.lastClickedAt ? moment.unix(Number(data.lastClickedAt) / 1000).fromNow() : "-";
  const createdAt = data.createdAt ? moment.unix(Number(data.createdAt) / 1000).format("lll") : "-";

  return (
    <div style={{ padding: 24 }}>
      <h2>Stats for: {data.urlCode}</h2>
      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <strong>Short URL: </strong>
          <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Target URL: </strong>
          <a href={data.originalLink} target="_blank" rel="noreferrer">{data.originalLink}</a>
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Total clicks: </strong>
          {data.visitCount || 0}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Last clicked: </strong>
          {lastClicked}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Created: </strong>
          {createdAt}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default Stats;
