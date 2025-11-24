import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import Modal from "react-modal";
import TextInput from "../../components/TextInput/TextInput.jsx";
import Button from "../../components/Button/Button.jsx";
import UrlTable from "../../components/UrlTable/UrlTable.jsx";
import { Link } from "react-router-dom";

import "./Dashboard.css";
import { updateUrlCode } from "../../Services/urlServices.js";
import urlStore from "../../store/urlStore.js";
import snackBarStore from "../../components/common/Snackbar/store/snackBarStore.js";
import httpClient from "../../Services/httpClient.js";

const Dashboard = observer(() => {
  const [editUrlData, setEditUrlData] = React.useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const { urlData, urlDataLoading, newUrlPayload, init, createNewUrl, showUrlAddView, setShowUrlAddView } = urlStore;
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    init();
  }, [init]);

  const renderEmptyState = () => {
    return (
      <div className="dashboard__empty-state">
        <p>You don’t have any short url</p>
        <Button onClick={() => setShowUrlAddView(true)} label="Create a new short url" variant="outlined-primary" />
      </div>
    );
  };
  const renderAddNewButton = () => {
    if (showUrlAddView) return null;
    return (
      <div className="dashboard__addNew">
        <Button onClick={() => setShowUrlAddView(true)} label="Create a new short url" variant="primary" />
      </div>
    );
  };

  const renderEditModal = () => {
    const onCancel = () => {
      setIsEditDialogOpen(false);
      setEditUrlData({});
    };
    return (
      <Modal isOpen={isEditDialogOpen} onRequestClose={onCancel} style={modalStyle}>
        <h3 style={{ marginBottom: 20 }}>Edit {editUrlData?.name}</h3>
        <TextInput
          style={{ marginBottom: 10 }}
          label="Original Url"
          placeholder="https://google.com/test/12"
          value={editUrlData?.originalLink || ""}
          onChange={(val) => setEditUrlData({ ...editUrlData, originalLink: val.toString() })}
        />
        <TextInput
          label="Name"
          placeholder="Another short url"
          value={editUrlData?.name || ""}
          onChange={(val) => setEditUrlData({ ...editUrlData, name: val.toString() })}
        />
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column" }}>
          <Button
            label="Update"
            onClick={async () => {
              if (editUrlData?.urlCode) {
                await updateUrlCode(editUrlData);
                snackBarStore.showSnackBar("Updated successfully");
                urlStore.fetchUrlsForUser();
                onCancel();
              }
            }}
            variant="outlined-primary"
            style={{ marginBottom: 10 }}
          />
          <Button label="Cancel" onClick={onCancel} variant="outlined-secondary" />
        </div>
      </Modal>
    );
  };

  const renderAddNewUrl = () => {
    return (
      <div className="dashbard__add-new">
        <TextInput
          label="Original Url"
          placeholder="https://google.com/test/12"
          value={newUrlPayload.originalLink}
          onChange={(val) => (urlStore.newUrlPayload.originalLink = val.toString())}
        />
        <TextInput
          label="Name"
          value={newUrlPayload.name || ""}
          placeholder="Online shopping"
          onChange={(val) => (urlStore.newUrlPayload.name = val.toString())}
        />
        <TextInput
          label="Custom Code (optional)"
          value={newUrlPayload.urlCode || ""}
          placeholder="my-docs"
          onChange={(val) => (urlStore.newUrlPayload.urlCode = val.toString())}
        />
        <div className="dashboard__add-new-actions">
          <Button label="Generate a short url" onClick={() => createNewUrl()} />
          <Button label="Cancel" variant="outlined-secondary" onClick={() => setShowUrlAddView(false)} />
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="card" style={{ maxWidth: 640, marginBottom: 16 }}>
        <TextInput
          label="Search (code or target)"
          placeholder="docs or https://example.com"
          value={search}
          onChange={(val) => setSearch(val.toString())}
        />
      </div>
      {showUrlAddView && <div className="card">{renderAddNewUrl()}</div>}
      {Boolean(urlData.length) ? renderAddNewButton() : (
        <div className="card">{renderEmptyState()}</div>
      )}
      {urlDataLoading && <h3 className="section-title">Loading...</h3>}

      {Boolean(urlData.length) && !urlDataLoading && (
        <div className="card">
          {renderEditModal()}
          <h3 className="section-title">Shortened url list</h3>
          <UrlTable
            columns={tableColumn}
            rows={urlData
              .filter((row) => {
                const q = search.trim().toLowerCase();
                if (!q) return true;
                return (
                  row.urlCode.toLowerCase().includes(q) ||
                  (row.originalLink || "").toLowerCase().includes(q)
                );
              })
              .map((_) => convertRowDataToTableData(_, setEditUrlData, setIsEditDialogOpen))}
          />
        </div>
      )}
    </div>
  );
});

const tableColumn = [
  { label: "Short code", field: "shortUrl" },
  { label: "Target URL", field: "targetUrl" },
  { label: "Total clicks", field: "visitCount" },
  { label: "Last clicked", field: "lastClickedAt" },
  { label: "Actions", field: "actions", hideLabelinMobile: true },
];

const convertRowDataToTableData = (data, setEditUrlData, setIsEditDialogOpen) => {
  const preferredBase = import.meta.env.VITE_SHORT_BASE_URL || new URL(httpClient.defaults.baseURL).origin;
  const shortBase = preferredBase.replace(/\/$/, "");
  const shortUrl = `${shortBase}/${data.urlCode}`;
  return {
    ...data,
    shortUrl: <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>,
    targetUrl: <a href={data.originalLink} target="_blank" rel="noreferrer">{data.originalLink}</a>,
    lastClickedAt: data.lastClickedAt
      ? moment.unix(Number(data.lastClickedAt) / 1000).fromNow()
      : "-",
    actions: renderActions(data, setEditUrlData, setIsEditDialogOpen),
  };
};

const renderActions = (data, setEditUrlData, setIsEditDialogOpen) => {
  return (
    <div style={{ display: "flex", maxWidth: 140, justifyContent: "space-between" }}>
      <Button
        label="Edit"
        variant="outlined-primary"
        onClick={() => {
          setEditUrlData(data);
          setIsEditDialogOpen(true);
        }}
      />
      <Link to={`/code/${data.urlCode}`} style={{ alignSelf: "center", textDecoration: "none" }}>
        <Button label="Stats" variant="outlined-primary" />
      </Link>
      <Button
        label="Delete"
        variant="outlined-secondary"
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete: ${data.name}?`)) {
            urlStore.deleteUrl(data.urlCode);
          }
        }}
      />
    </div>
  );
};

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    maxWidth: 500,
    width: "100%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    background: "rgba(0, 0, 0, .5)",
  },
};

export default Dashboard;
