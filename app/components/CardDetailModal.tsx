import * as React from "react";

import type { Dispatch, SetStateAction } from "react";
import type { Job, List } from "~/types";

import { Form } from "@remix-run/react";

type CardDetailModalProps = {
  job: Job | null;
  lists: List[];
  setIsDetailOpen: Dispatch<SetStateAction<boolean>>;
};

export const CardDetailModal = ({
  job,
  setIsDetailOpen,
  lists,
}: CardDetailModalProps) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
    React.useState<boolean>(false);

  if (!job) return null;

  const { company, title, description, url, listId } = job;

  return (
    <div className="modal-container" onClick={() => setIsDetailOpen(false)}>
      <div className="job-details" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="close-button"
            onClick={() => setIsDetailOpen(false)}
          >
            X
          </button>
        </div>
        {/* TODO: add useSubmit hook to save form on field change */}
        <Form method="post">
          <div className="form-row">
            <div className="form-col">
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
            </div>
            <div className="form-col">
              <label htmlFor="status">Status</label>
              <select defaultValue={listId}>
                {lists.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
              <label htmlFor="url">URL</label>
              <input
                id="url"
                placeholder="Link to job description/company"
                type="url"
                defaultValue={url ?? ""}
              />
            </div>
          </div>

          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            placeholder="Job description"
            defaultValue={description ?? ""}
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
              <div className="warning-modal">
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
