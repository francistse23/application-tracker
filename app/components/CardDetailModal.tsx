import * as React from "react";

import type { Dispatch, SetStateAction } from "react";

import { Form } from "@remix-run/react";
import type { Job } from "~/types";

type CardDetailModalProps = {
  job: Job | null;
  setIsDetailOpen: Dispatch<SetStateAction<boolean>>;
};

export const CardDetailModal = ({
  job,
  setIsDetailOpen,
}: CardDetailModalProps) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
    React.useState<boolean>(false);

  if (!job) return null;

  const { company, title, description, url } = job;

  return (
    <div className="modal-container" onClick={() => setIsDetailOpen(false)}>
      <div className="job-details" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={() => setIsDetailOpen(false)}>
          X
        </button>
        <Form method="post">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            placeholder="Company"
            type="text"
            value={company}
            required
          />
          <label htmlFor="title">Title</label>
          <input
            id="title"
            placeholder="Job title"
            type="text"
            value={title}
            required
          />
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            placeholder="Job description"
            value={description}
          />
          <label htmlFor="url">URL</label>
          <input
            id="url"
            placeholder="Link to job description/company"
            type="url"
            value={url ?? ""}
          />
          <div className="buttons-container">
            <input type="hidden" name="json" value={JSON.stringify(job)} />
            <button type="submit" className="button">
              Save
            </button>
            <button
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="button danger-button"
            >
              Delete
            </button>
          </div>
          {isConfirmDeleteOpen && (
            <div className="modal-container">
              <div
                style={{
                  backgroundColor: "var(--color-background)",
                  borderRadius: "0.25rem",
                  zIndex: 100,
                  padding: "3rem 4rem",
                }}
              >
                <span>Are you sure you want to delete this job?</span>
                <div className="buttons-container">
                  <button
                    className="button"
                    onClick={() => setIsConfirmDeleteOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    name="intent"
                    value="delete"
                    className="button danger-button"
                    onClick={() => {
                      setIsConfirmDeleteOpen(false);
                      setIsDetailOpen(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};
