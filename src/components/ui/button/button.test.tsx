import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Button } from "./button";

const TEST_DATA = {
  text: 'test text',
}

describe("Тестирование компонента 'Button'", () => {

  test("Компонент 'Button' без текста формируется без ошибок", () => {
    render(<Button />);
    const btn = screen.getByRole("button");
    expect(btn).toMatchSnapshot();
  });

  test("Компонент 'Button' c текстом формируется без ошибок", () => {
    render(<Button text={TEST_DATA.text} />);
    const btn = screen.getByRole("button");
    expect(btn).toMatchSnapshot();
  });

  test("Компонент 'Button' со свойством 'disabled' формируется без ошибок", () => {
    render(<Button disabled={true} />);
    const btn = screen.getByRole("button");
    expect(btn).toMatchSnapshot();
  });

  test("Компонент 'Button' с индикацией загрузки формируется без ошибок", () => {
    render(<Button isLoader={true} />);
    const btn = screen.getByRole("button");
    expect(btn).toMatchSnapshot();
  });

  test("Компонент 'Button' с вызовом функции по нажатию обрабатывает вызов корректно, ", () => {
    const clickHandler = vi.fn(() => 0);
    const { container } = render(<Button onClick={clickHandler} />);
    const btn = container.firstChild;
    expect(btn).toMatchSnapshot();  
    fireEvent.click(btn as Element);
    expect(clickHandler).toHaveBeenCalledOnce();
  });

})
