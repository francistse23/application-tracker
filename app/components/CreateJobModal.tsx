import { Form } from "@remix-run/react";

export default function CreateJobModal() {
  return (
    <Form method="post">
      <span>Add job</span>
      <p>
        <label>
          Company
          <input />
        </label>
      </p>
      <p>
        <label>
          Job Title
          <input />
        </label>
      </p>
      <div>
        {/* TODO: Add functionality to select which board */}
        {/* <p>
          <label>
            Board
            <input />
          </label>
        </p> */}
        <p>
          <label>
            List
            <input />
          </label>
        </p>
      </div>
    </Form>
  );
}
