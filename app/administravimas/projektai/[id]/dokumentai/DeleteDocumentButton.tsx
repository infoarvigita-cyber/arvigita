"use client";

import { useState } from "react";

import { deleteProjectDocument } from "./actions";

type DeleteDocumentButtonProps = {
  documentId: string;
  projectId: string;
  fileName: string;
};

export default function DeleteDocumentButton({
  documentId,
  projectId,
  fileName,
}: DeleteDocumentButtonProps) {
  const [showConfirm, setShowConfirm] =
    useState(false);

  if (!showConfirm) {
    return (
      <button
        type="button"
        className="portal-button portal-button-secondary"
        onClick={() => setShowConfirm(true)}
      >
        Ištrinti
      </button>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxWidth: "320px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.9rem",
        }}
      >
        Ar tikrai norite ištrinti{" "}
        <strong>{fileName}</strong>?
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <form action={deleteProjectDocument}>
          <input
            type="hidden"
            name="document_id"
            value={documentId}
          />

          <input
            type="hidden"
            name="project_id"
            value={projectId}
          />

          <button
            type="submit"
            className="portal-button"
          >
            Taip, ištrinti
          </button>
        </form>

        <button
          type="button"
          className="portal-button portal-button-secondary"
          onClick={() => setShowConfirm(false)}
        >
          Atšaukti
        </button>
      </div>
    </div>
  );
}