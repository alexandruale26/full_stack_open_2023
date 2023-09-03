import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BlogForm from "../src/components/BlogForm";

test("a new blog is created", () => {
  const createBlog = jest.fn();

  const { container } = render(<BlogForm createBlog={createBlog} />);
  const inputTitle = container.querySelector("#title");
  const inputAuthor = container.querySelector("#author");
  const inputUrl = container.querySelector("#url");
  const form = container.querySelector("form");

  fireEvent.change(inputTitle, { target: { value: "Tests are not fun" } });
  fireEvent.change(inputAuthor, { target: { value: "Einstein" } });
  fireEvent.change(inputUrl, { target: { value: "www.testsarefun.com" } });
  fireEvent.submit(form);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Tests are not fun");
  expect(createBlog.mock.calls[0][0].author).toBe("Einstein");
  expect(createBlog.mock.calls[0][0].url).toBe("www.testsarefun.com");
});
