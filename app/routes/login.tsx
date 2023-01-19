import * as React from "react";

import {
  validatePassword,
  validateUrl,
  validateUsername,
} from "~/utils/helpers";
import * as EmailValidator from "email-validator";

import { type ActionArgs } from "@remix-run/node";
import { badRequest } from "~/utils/request.server";
import { db } from "~/utils/db.server";
import { useActionData, useSearchParams } from "@remix-run/react";
import { createUserSession, login, register } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const email = form.get("email");
  const password = form.get("password");
  const confirmPassword = form.get("confirm-password");
  const redirectTo = validateUrl((form.get("redirectTo") as string) || "/");

  const failedTypeCheck =
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string" ||
    (loginType === "register" &&
      (typeof email !== "string" || typeof confirmPassword !== "string"));

  if (failedTypeCheck) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = {
    email: email ?? undefined,
    loginType,
    username,
    password,
    confirmPassword: confirmPassword ?? undefined,
  };

  const fieldErrors =
    loginType === "register"
      ? {
          email:
            typeof email === "string" && EmailValidator.validate(email)
              ? undefined
              : "Invalid email",
          username: validateUsername(username),
          password: validatePassword(password),
          confirmPassword:
            password !== confirmPassword
              ? "The passwords don't match"
              : undefined,
        }
      : {
          email: undefined,
          confirmPassword: undefined,
          username: validateUsername(username),
          password: validatePassword(password),
        };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    // login to get the user
    case "login": {
      const user = await login({ username, password });

      // if there's no user, return the fields and a formError
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: "Username/password combination is incorrect",
        });
      }

      return createUserSession({ userId: user.id, redirectTo: "/boards/1" });
    }
    case "register": {
      if (typeof email !== "string") {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: "Invalid email",
        });
      }
      const userExists = await db.user.findFirst({
        where: { username, email },
      });

      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with username ${username} already exists`,
        });
      }
      // create the user
      // create their session and redirect to /jokes
      const user = await register({ username, password, email });

      if (!user) {
        badRequest({
          fieldErrors: null,
          fields,
          formError: `Something went wrong when trying to create a new user`,
        });
      }

      return createUserSession({ userId: user.id, redirectTo });
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const [type, setType] = React.useState(
    actionData?.fields?.loginType || "login"
  );

  return (
    <div>
      <div>
        <h1 style={{ textTransform: "capitalize" }}>{type}</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset>
            <legend>Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                onChange={(e) => setType(e.target.value)}
                defaultChecked={type === "login"}
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                onChange={(e) => setType(e.target.value)}
                defaultChecked={type === "register"}
              />{" "}
              Register
            </label>
          </fieldset>
          {type === "register" && (
            <div>
              <label htmlFor="email-input">Email</label>
              <input
                type="email"
                id="email-input"
                name="email"
                placeholder="Email"
                defaultValue={actionData?.fields?.email}
                aria-invalid={!!actionData?.fieldErrors?.email}
                aria-errormessage={
                  actionData?.fieldErrors?.email ? "email-error" : undefined
                }
              />
              {actionData?.fieldErrors?.email ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="email-error"
                >
                  {actionData.fieldErrors.email}
                </p>
              ) : null}
            </div>
          )}
          <div>
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              id="username-input"
              name="username"
              placeholder="Username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={!!actionData?.fieldErrors?.username}
              aria-errormessage={
                actionData?.fieldErrors?.username ? "username-error" : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              type="password"
              placeholder="Password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={!!actionData?.fieldErrors?.password}
              aria-errormessage={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          {type === "register" && (
            <div>
              <label htmlFor="confirm-password-input">Confirm Password</label>
              <input
                id="confirm-password-input"
                name="confirm-password"
                type="password"
                placeholder="Enter your password again"
                aria-invalid={!!actionData?.fieldErrors?.confirmPassword}
                aria-errormessage={
                  actionData?.fieldErrors?.confirmPassword
                    ? "confirm-password-error"
                    : undefined
                }
              />
              {actionData?.fieldErrors?.confirmPassword ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="confirm-password-error"
                >
                  {actionData.fieldErrors.confirmPassword}
                </p>
              ) : null}
            </div>
          )}
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
