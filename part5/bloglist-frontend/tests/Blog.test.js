import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "../src/components/Blog";

describe("<Blog/>", () => {
  let container = undefined;

  const mockUpdate = jest.fn();
  const mockRemove = jest.fn();
  const blog = {
    title: "Tests are fun",
    author: "Einstein",
    url: "www.testsarefun.com",
    likes: 127,
    user: {
      username: "dan",
      name: "Daniel",
    },
  };

  beforeEach(() => {
    container = render(<Blog blog={blog} update={mockUpdate} remove={mockRemove} />).container;
  });

  test("renders content", () => {
    expect(container).toBeDefined();
  });

  test("renders only title and author", () => {
    const visibleElement = screen.getByText("Einstein", { exact: false });
    expect(visibleElement).toBeVisible();

    const invisibleElement = container.querySelector(".blogHidden");
    expect(invisibleElement).toHaveStyle("display: none");
    expect(invisibleElement).not.toBeVisible();
  });

  test("renders url and likes if show button is clicked", () => {
    const button = screen.getByText("view");
    fireEvent.click(button);

    const element = container.querySelector(".blogHidden");
    expect(element).toBeVisible();
    expect(element).toHaveTextContent("www.testsarefun.com");
    expect(element).toHaveTextContent("127");
  });

  test("like button clicked twice works corect", async () => {
    const updateLikes = jest.fn();
    const user = userEvent.setup();

    container = render(<Blog blog={blog} update={updateLikes} remove={mockRemove} />).container;
    const likeButton = container.querySelector(".likeButton");

    await user.dblClick(likeButton);
    expect(updateLikes.mock.calls).toHaveLength(2);
  });
});
